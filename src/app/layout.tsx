import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "EcoStep | Your Personalized Carbon Footprint reduction Assistant",
  description: "Calculate your personal carbon footprint in under 5 minutes and get customized, AI-driven climate coaching. Track daily habits, log activities, and earn streaks to save the planet.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EcoStep",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#16A34A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Anti-crash polyfills for browser extensions and legacy APIs */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;

                // Helper to check if an error relates to the extension 'addListener' crash
                var isExtensionError = function(msg, err) {
                  var text = (msg || '') + (err && (err.message || err.stack) || '');
                  return text.indexOf('addListener') !== -1;
                };

                // Intercept uncaught errors in the capture phase (before Next.js dev overlay registers)
                window.addEventListener('error', function(e) {
                  if (isExtensionError(e.message, e.error)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);

                // Intercept unhandled promise rejections
                window.addEventListener('unhandledrejection', function(e) {
                  var reason = e.reason;
                  if (reason && isExtensionError(reason.message, reason)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);

                // Intercept legacy window.onerror callbacks
                var originalOnError = window.onerror;
                window.onerror = function(msg, url, line, col, err) {
                  if (isExtensionError(msg, err)) {
                    return true; // Suppress error overlay
                  }
                  if (originalOnError) {
                    return originalOnError.apply(this, arguments);
                  }
                };

                // 1. Polyfill window.matchMedia listener methods if missing
                if (typeof window.matchMedia === 'function') {
                  var originalMatchMedia = window.matchMedia;
                  window.matchMedia = function(query) {
                    try {
                      var mql = originalMatchMedia.call(window, query);
                      if (mql) {
                        if (typeof mql.addListener !== 'function') {
                          mql.addListener = function(cb) {
                            if (typeof mql.addEventListener === 'function') {
                              mql.addEventListener('change', cb);
                            }
                          };
                        }
                        if (typeof mql.removeListener !== 'function') {
                          mql.removeListener = function(cb) {
                            if (typeof mql.removeEventListener === 'function') {
                              mql.removeEventListener('change', cb);
                            }
                          };
                        }
                      }
                      return mql;
                    } catch (e) {
                      return {
                        matches: false,
                        media: query,
                        onchange: null,
                        addListener: function() {},
                        removeListener: function() {},
                        addEventListener: function() {},
                        removeEventListener: function() {},
                        dispatchEvent: function() { return false; }
                      };
                    }
                  };
                } else {
                  window.matchMedia = function(query) {
                    return {
                      matches: false,
                      media: query,
                      onchange: null,
                      addListener: function() {},
                      removeListener: function() {},
                      addEventListener: function() {},
                      removeEventListener: function() {},
                      dispatchEvent: function() { return false; }
                    };
                  };
                }

                // 2. Safe Chrome Extension Proxy to catch and absorb extension API calls (like addListener)
                var createSafeNamespace = function(baseObj) {
                  var noop = function() {};
                  noop.addListener = noop;
                  noop.removeListener = noop;
                  noop.hasListener = function() { return false; };
                  
                  return new Proxy(baseObj || noop, {
                    get: function(target, prop) {
                      if (typeof prop === 'symbol' || prop === 'prototype' || prop === 'name') {
                        return target[prop];
                      }
                      if (prop in target && target[prop] !== undefined) {
                        var val = target[prop];
                        if (typeof val === 'object' && val !== null) {
                          return createSafeNamespace(val);
                        }
                        return val;
                      }
                      return createSafeNamespace(undefined);
                    },
                    apply: function(target, thisArg, argumentsList) {
                      if (typeof target === 'function' && target !== noop) {
                        return target.apply(thisArg, argumentsList);
                      }
                      return undefined;
                    }
                  });
                };

                window.chrome = createSafeNamespace(window.chrome);
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased font-sans bg-gray-50 text-gray-900 min-h-screen">
        {children}
        
        {/* Service Worker Registration for PWA support */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
