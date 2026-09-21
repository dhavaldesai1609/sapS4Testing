/**
 * Low-level bridge: discovers UI5 controls via the runtime registry
 * (Element.registry / Core.byId) instead of fragile DOM selectors.
 */
import { Page } from '@playwright/test';
import type { ControlQuery, ControlInfo } from './types';

const DISCOVERY_SCRIPT = `
(function(query) {
  function isVisible(ctrl) {
    try {
      if (typeof ctrl.getVisible === 'function' && !ctrl.getVisible()) return false;
      var dom = ctrl.getDomRef && ctrl.getDomRef();
      if (!dom) return false;
      var style = window.getComputedStyle(dom);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      return true;
    } catch (e) { return false; }
  }

  function getProp(ctrl, name) {
    try {
      var getter = 'get' + name.charAt(0).toUpperCase() + name.slice(1);
      if (typeof ctrl[getter] === 'function') return ctrl[getter]();
      if (typeof ctrl.getProperty === 'function') return ctrl.getProperty(name);
    } catch (e) {}
    return undefined;
  }

  function matchProps(ctrl, props) {
    if (!props) return true;
    for (var key in props) {
      var expected = props[key];
      var actual = getProp(ctrl, key);
      if (actual === undefined || actual === null) actual = '';
      actual = String(actual);
      if (expected && typeof expected === 'object' && expected.source) {
        if (!new RegExp(expected.source, expected.flags || '').test(actual)) return false;
      } else if (String(expected) !== actual) {
        return false;
      }
    }
    return true;
  }

  function toInfo(ctrl) {
    var id = ctrl.getId ? ctrl.getId() : '';
    var meta = ctrl.getMetadata ? ctrl.getMetadata() : null;
    var type = meta && meta.getName ? meta.getName() : 'Unknown';
    var dom = ctrl.getDomRef && ctrl.getDomRef();
    return {
      id: id,
      controlType: type,
      visible: isVisible(ctrl),
      enabled: typeof ctrl.getEnabled === 'function' ? !!ctrl.getEnabled() : true,
      text: getProp(ctrl, 'text') != null ? String(getProp(ctrl, 'text')) : undefined,
      value: getProp(ctrl, 'value') != null ? String(getProp(ctrl, 'value')) : undefined,
      selectedKey: getProp(ctrl, 'selectedKey') != null ? String(getProp(ctrl, 'selectedKey')) : undefined,
      properties: {},
      domRefId: dom ? dom.id : undefined
    };
  }

  var sap = window.sap;
  if (!sap || !sap.ui) return [];

  var candidates = [];

  if (query.id && typeof query.id === 'string' && sap.ui.getCore) {
    var byId = sap.ui.getCore().byId(query.id);
    if (byId) candidates.push(byId);
  }

  var all = [];
  try {
    if (sap.ui.core && sap.ui.core.Element && sap.ui.core.Element.registry) {
      var reg = sap.ui.core.Element.registry;
      if (typeof reg.all === 'function') {
        var map = reg.all();
        for (var k in map) if (map.hasOwnProperty(k)) all.push(map[k]);
      } else if (reg.mElements) {
        for (var k2 in reg.mElements) if (reg.mElements.hasOwnProperty(k2)) all.push(reg.mElements[k2]);
      }
    }
  } catch (e) {}

  if (all.length === 0 && sap.ui.getCore) {
    try {
      var core = sap.ui.getCore();
      if (core.mElements) {
        for (var k3 in core.mElements) if (core.mElements.hasOwnProperty(k3)) all.push(core.mElements[k3]);
      }
    } catch (e) {}
  }

  if (all.length === 0) {
    try {
      if (sap.ui.test && sap.ui.test.OpaPlugin) {
        var plugin = new sap.ui.test.OpaPlugin();
        all = plugin.getAllControls() || [];
      }
    } catch (e) {}
  }

  for (var i = 0; i < all.length; i++) {
    var c = all[i];
    if (!c) continue;

    if (query.id) {
      var cid = c.getId ? c.getId() : '';
      if (typeof query.id === 'string') {
        if (cid !== query.id && cid.indexOf(query.id) === -1) continue;
      } else if (query.id.source) {
        if (!new RegExp(query.id.source, query.id.flags || '').test(cid)) continue;
      }
    }

    if (query.controlType) {
      var meta2 = c.getMetadata ? c.getMetadata() : null;
      var t = meta2 && meta2.getName ? meta2.getName() : '';
      if (t !== query.controlType && t.indexOf(query.controlType) === -1) continue;
    }

    if (query.properties && !matchProps(c, query.properties)) continue;
    if (query.visible !== false && !isVisible(c)) continue;

    if (query.searchOpenDialogs) {
      var parent = c;
      var inDialog = false;
      while (parent) {
        var pm = parent.getMetadata ? parent.getMetadata() : null;
        var pn = pm && pm.getName ? pm.getName() : '';
        if (pn === 'sap.m.Dialog' || pn === 'sap.m.Popover' || pn.indexOf('Dialog') >= 0) {
          inDialog = true;
          break;
        }
        parent = parent.getParent ? parent.getParent() : null;
      }
      if (!inDialog) continue;
    }

    candidates.push(c);
  }

  var seen = {};
  var unique = [];
  for (var j = 0; j < candidates.length; j++) {
    var idj = candidates[j].getId ? candidates[j].getId() : String(j);
    if (!seen[idj]) {
      seen[idj] = true;
      unique.push(candidates[j]);
    }
  }

  var infos = unique.map(toInfo);
  if (typeof query.index === 'number' && query.index >= 0) {
    return infos[query.index] ? [infos[query.index]] : [];
  }
  return infos;
})
`;

export async function discoverControls(page: Page, query: ControlQuery): Promise<ControlInfo[]> {
  const serializable = {
    ...query,
    id: query.id instanceof RegExp ? { source: query.id.source, flags: query.id.flags } : query.id,
    properties: query.properties
      ? Object.fromEntries(
          Object.entries(query.properties).map(([k, v]) =>
            v instanceof RegExp ? [k, { source: v.source, flags: v.flags }] : [k, v]
          )
        )
      : undefined,
  };

  return page.evaluate(
    ({ script, q }) => {
      const fn = eval(`(${script})`);
      return fn(q);
    },
    { script: DISCOVERY_SCRIPT, q: serializable }
  );
}

export async function getControlById(page: Page, id: string): Promise<ControlInfo | null> {
  const list = await discoverControls(page, { id, visible: false });
  return list[0] ?? null;
}
