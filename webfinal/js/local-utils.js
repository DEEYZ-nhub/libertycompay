/**
 * local-utils.js - Utilidades compartidas para localStorage seguro
 * Expone funciones seguras para leer/escribir datos JSON en localStorage
 */

(function(global) {
  'use strict';

  /**
   * Lector seguro de JSON desde localStorage
   * @param {string} key - Clave en localStorage
   * @param {*} fallback - Valor a retornar si error o no existe
   * @returns {*} El valor parseado o el fallback
   */
  function safeGetLocalJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return typeof fallback === 'undefined' ? null : fallback;
      return JSON.parse(raw);
    } catch (e) {
      // En desarrollo, mostrar warning; en producción, silencioso
      if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
        console.warn('[safeGetLocalJSON] Error parsing', key, ':', e.message);
      }
      return typeof fallback === 'undefined' ? null : fallback;
    }
  }

  /**
   * Escritor seguro de JSON a localStorage
   * @param {string} key - Clave en localStorage
   * @param {*} value - Valor a guardar (se stringifica automáticamente)
   * @returns {boolean} true si éxito, false si error
   */
  function safeSetLocalJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('[safeSetLocalJSON] Error setting', key, ':', e);
      return false;
    }
  }

  /**
   * Eliminar clave de localStorage de forma segura
   * @param {string} key - Clave a eliminar
   * @returns {boolean} true si éxito
   */
  function safeRemoveLocalJSON(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('[safeRemoveLocalJSON] Error removing', key, ':', e);
      return false;
    }
  }

  // Exponer globalmente
  global.safeGetLocalJSON = safeGetLocalJSON;
  global.safeSetLocalJSON = safeSetLocalJSON;
  global.safeRemoveLocalJSON = safeRemoveLocalJSON;

})(typeof window !== 'undefined' ? window : global);
