import { createReadableStreamFromReadable } from '@react-router/node';
import { isbot } from 'isbot';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { ServerRouter, UNSAFE_withComponentProps, Outlet, useNavigate, useLocation, Meta, Links, ScrollRestoration, Scripts, useRouteError, useAsyncError } from 'react-router';
import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { forwardRef, useEffect, createElement, useRef, useState, Component, useCallback } from 'react';
import { useButton } from '@react-aria/button';
import { f as fetchWithHeaders } from './index-xkrYs5ug.js';
import { SessionProvider, useSession, signIn, signOut } from '@hono/auth-js/react';
import { toPng } from 'html-to-image';
import { serializeError } from 'serialize-error';
import { Toaster, toast } from 'sonner';
import { useIdleTimer } from 'react-idle-timer';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { LayoutDashboard, ArrowRight, LogOut, Bell, Users, Calendar, Award, FileText, AlertCircle, TrendingUp, Plus, XCircle, CheckCircle2, Clock, ArrowLeft, Check, X, Info, Loader2, FolderOpen, UploadCloud, ChevronRight, Upload, Search, Eye, Trash2, AlertTriangle, Download, Edit, Briefcase, MapPin, GraduationCap, Phone, Mail } from 'lucide-react';
import { NavLink, Outlet as Outlet$1, useParams } from 'react-router-dom';
import clsx from 'classnames';
import 'hono/factory';
import '@hono/node-server';
import '@hono/node-server/serve-static';
import 'hono';
import 'hono/logger';
import 'node:async_hooks';
import 'node:console';
import '@auth/core';
import '@auth/core/providers/credentials';
import '@hono/auth-js';
import '@neondatabase/serverless';
import 'hono/context-storage';
import 'hono/cors';
import 'hono/proxy';
import 'hono/body-limit';
import 'hono/request-id';
import '@auth/core/jwt';
import 'node:path';
import 'node:fs';
import 'node:url';
import '@react-router/dev/routes';
import 'clean-stack';
import '@auth/core/errors';
import 'bcryptjs';

const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, _loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");
    const readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const {
      pipe,
      abort
    } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
      context: routerContext,
      url: request.url
    }), {
      [readyOption]() {
        shellRendered = true;
        const body = new PassThrough();
        const stream = createReadableStreamFromReadable(body);
        responseHeaders.set("Content-Type", "text/html");
        resolve(new Response(stream, {
          headers: responseHeaders,
          status: responseStatusCode
        }));
        pipe(body);
      },
      onShellError(error) {
        reject(error);
      },
      onError(error) {
        responseStatusCode = 500;
        if (shellRendered) {
          console.error(error);
        }
      }
    });
    setTimeout(abort, ABORT_DELAY);
  });
}

const entryServer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: 'Module' }));

const JSX_RENDER_ID_ATTRIBUTE_NAME = "data-render-id";
function buildGridPlaceholder(w, h) {
  const size = Math.max(w, h);
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 895 895" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="895" height="895" fill="#E9E7E7"/>
<g>
<line x1="447.505" y1="-23" x2="447.505" y2="901" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="889.335" y1="447.505" x2="5.66443" y2="447.505" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="889.335" y1="278.068" x2="5.66443" y2="278.068" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="889.335" y1="57.1505" x2="5.66443" y2="57.1504" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="61.8051" y1="883.671" x2="61.8051" y2="6.10572e-05" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="282.495" y1="907" x2="282.495" y2="-30" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="611.495" y1="907" x2="611.495" y2="-30" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="832.185" y1="883.671" x2="832.185" y2="6.10572e-05" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="889.335" y1="827.53" x2="5.66443" y2="827.53" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="889.335" y1="606.613" x2="5.66443" y2="606.612" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="4.3568" y1="4.6428" x2="889.357" y2="888.643" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="-0.3568" y1="894.643" x2="894.643" y2="0.642772" stroke="#C0C0C0" stroke-width="1.00975"/>
<circle cx="447.5" cy="441.5" r="163.995" stroke="#C0C0C0" stroke-width="1.00975"/>
<circle cx="447.911" cy="447.911" r="237.407" stroke="#C0C0C0" stroke-width="1.00975"/>
<circle cx="448" cy="442" r="384.495" stroke="#C0C0C0" stroke-width="1.00975"/>
</g>
</svg>
`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
function useOptionalRef(ref) {
  const fallbackRef = useRef(null);
  if (ref && "instance" in ref) return fallbackRef;
  return ref ?? fallbackRef;
}
const CreatePolymorphicComponent = /* @__PURE__ */ forwardRef(
  // @ts-expect-error -- generic forwardRef signature doesn't propagate the As type param
  function CreatePolymorphicComponentRender({
    as,
    children,
    renderId,
    onError,
    ...rest
  }, forwardedRef) {
    const props = as === "img" ? {
      ...rest,
      // keep the original type of onError for <img>
      onError: (e) => {
        if (typeof onError === "function") onError(e);
        const img = e.currentTarget;
        const {
          width,
          height
        } = img.getBoundingClientRect();
        img.dataset.hasFallback = "1";
        img.onerror = null;
        img.src = buildGridPlaceholder(Math.round(width) || 128, Math.round(height) || 128);
        img.style.objectFit = "cover";
      }
    } : rest;
    const ref = useOptionalRef(forwardedRef);
    useEffect(() => {
      const el = ref && "current" in ref ? ref.current : null;
      if (!el) return;
      if (as !== "img") {
        const placeholder = () => {
          const {
            width,
            height
          } = el.getBoundingClientRect();
          return buildGridPlaceholder(Math.round(width) || 128, Math.round(height) || 128);
        };
        const applyBgFallback = () => {
          el.dataset.hasFallback = "1";
          el.style.backgroundImage = `url("${placeholder()}")`;
          el.style.backgroundSize = "cover";
        };
        const probeBg = () => {
          const bg = getComputedStyle(el).backgroundImage;
          const match = /url\(["']?(.+?)["']?\)/.exec(bg);
          const src = match?.[1];
          if (!src) return;
          const probe = new Image();
          probe.onerror = applyBgFallback;
          probe.src = src;
        };
        probeBg();
        const ro2 = new ResizeObserver(([entry]) => {
          if (!el.dataset.hasFallback) return;
          const {
            width,
            height
          } = entry.contentRect;
          el.style.backgroundImage = `url("${buildGridPlaceholder(Math.round(width) || 128, Math.round(height) || 128)}")`;
        });
        ro2.observe(el);
        const mo = new MutationObserver(probeBg);
        mo.observe(el, {
          attributes: true,
          attributeFilter: ["style", "class"]
        });
        return () => {
          ro2.disconnect();
          mo.disconnect();
        };
      }
      if (!el.dataset.hasFallback) return;
      const ro = new ResizeObserver(([entry]) => {
        const {
          width,
          height
        } = entry.contentRect;
        el.src = buildGridPlaceholder(Math.round(width) || 128, Math.round(height) || 128);
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [as, ref]);
    return /* @__PURE__ */ createElement(as, Object.assign({}, props, {
      ref,
      ...renderId ? {
        [JSX_RENDER_ID_ATTRIBUTE_NAME]: renderId
      } : void 0
    }), children);
  }
);

function LoadFonts() {
  return /* @__PURE__ */ jsx(Fragment, {});
}

function useDevServerHeartbeat() {
  useIdleTimer({
    disabled: typeof window === "undefined",
    throttle: 6e4 * 3,
    timeout: 6e4,
    onAction: () => {
      fetch("/", {
        method: "GET"
      }).catch((error) => {
      });
    }
  });
}

const links = () => [];
if (globalThis.window && globalThis.window !== void 0) {
  globalThis.window.fetch = fetchWithHeaders;
}
const LoadFontsSSR = LoadFonts ;
function InternalErrorBoundary({
  error: errorArg
}) {
  const routeError = useRouteError();
  const asyncError = useAsyncError();
  const error = errorArg ?? asyncError ?? routeError;
  const [isOpen, setIsOpen] = useState(false);
  const shouldScale = typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const scaleFactor = shouldScale ? 1.02 : 1;
  const copyButtonTextClass = shouldScale ? "text-sm" : "text-xs";
  const copyButtonPaddingClass = shouldScale ? "px-[10px] py-[5px]" : "px-[6px] py-[3px]";
  const postCountRef = useRef(0);
  const lastPostTimeRef = useRef(0);
  const lastErrorKeyRef = useRef(null);
  const MAX_ERROR_POSTS_PER_ERROR = 5;
  const THROTTLE_MS = 1e3;
  useEffect(() => {
    const serialized = serializeError(error);
    const errorKey = JSON.stringify(serialized);
    if (errorKey !== lastErrorKeyRef.current) {
      lastErrorKeyRef.current = errorKey;
      postCountRef.current = 0;
    }
    if (postCountRef.current >= MAX_ERROR_POSTS_PER_ERROR) {
      return;
    }
    const now = Date.now();
    const timeSinceLastPost = now - lastPostTimeRef.current;
    const post = () => {
      if (postCountRef.current >= MAX_ERROR_POSTS_PER_ERROR) {
        return;
      }
      postCountRef.current += 1;
      lastPostTimeRef.current = Date.now();
      window.parent.postMessage({
        type: "sandbox:error:detected",
        error: serialized
      }, "*");
    };
    if (timeSinceLastPost < THROTTLE_MS) {
      const timer = setTimeout(post, THROTTLE_MS - timeSinceLastPost);
      return () => clearTimeout(timer);
    }
    post();
  }, [error]);
  useEffect(() => {
    const animateTimer = setTimeout(() => setIsOpen(true), 100);
    return () => clearTimeout(animateTimer);
  }, []);
  const {
    buttonProps: copyButtonProps
  } = useButton({
    onPress: useCallback(() => {
      const toastScale = shouldScale ? 1.2 : 1;
      const toastStyle = {
        padding: `${16 * toastScale}px`,
        background: "#18191B",
        border: "1px solid #2C2D2F",
        color: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: `${280 * toastScale}px`,
        fontSize: `${13 * toastScale}px`,
        display: "flex",
        alignItems: "center",
        gap: `${6 * toastScale}px`,
        justifyContent: "flex-start",
        margin: "0 auto"
      };
      navigator.clipboard.writeText(JSON.stringify(serializeError(error)));
      toast.custom(() => /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        style: toastStyle,
        renderId: "render-a70e742e",
        as: "div",
        children: [/* @__PURE__ */ jsxs("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor",
          height: "20",
          width: "20",
          children: [/* @__PURE__ */ jsx("title", {
            children: "Success"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            fillRule: "evenodd",
            d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
            clipRule: "evenodd",
            renderId: "render-e23582f9",
            as: "path"
          })]
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          renderId: "render-0749dd88",
          as: "span",
          children: "Copied successfully!"
        })]
      }), {
        id: "copy-error-success",
        duration: 3e3
      });
    }, [error, shouldScale])
  }, useRef(null));
  function isInIframe() {
    try {
      return window.parent !== window;
    } catch {
      return true;
    }
  }
  return /* @__PURE__ */ jsx(Fragment, {
    children: !isInIframe() && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: `fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-md z-50 transition-all duration-500 ease-out ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`,
      style: {
        width: "75vw"
      },
      renderId: "render-70925c15",
      as: "div",
      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "bg-[#18191B] text-[#F2F2F2] rounded-lg p-4 shadow-lg w-full",
        style: scaleFactor !== 1 ? {
          transform: `scale(${scaleFactor})`,
          transformOrigin: "bottom center"
        } : void 0,
        renderId: "render-91cadfe8",
        as: "div",
        children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex items-start gap-3",
          renderId: "render-908f350b",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "flex-shrink-0",
            renderId: "render-1a98d325",
            as: "div",
            children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "w-8 h-8 bg-[#F2F2F2] rounded-full flex items-center justify-center",
              renderId: "render-15860d83",
              as: "div",
              children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-black text-[1.125rem] leading-none",
                renderId: "render-57d2cf3f",
                as: "span",
                children: "!"
              })
            })
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex flex-col gap-2 flex-1",
            renderId: "render-d79b6ff4",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "flex flex-col gap-1",
              renderId: "render-8ad81342",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "font-light text-[#F2F2F2] text-sm",
                renderId: "render-8bfb997e",
                as: "p",
                children: "App Error Detected"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-[#959697] text-sm font-light",
                renderId: "render-ef304cef",
                as: "p",
                children: "It looks like an error occurred while trying to use your app."
              })]
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: `flex flex-row items-center justify-center gap-[4px] outline-none transition-colors rounded-[8px] border-[1px] bg-[#2C2D2F] hover:bg-[#414243] active:bg-[#555658] border-[#414243] text-white ${copyButtonTextClass} ${copyButtonPaddingClass} w-fit`,
              type: "button",
              ...copyButtonProps,
              renderId: "render-6d6d031c",
              as: "button",
              children: "Copy error"
            })]
          })]
        })
      })
    })
  });
}
class ErrorBoundaryWrapper extends Component {
  state = {
    hasError: false,
    error: null
  };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error, info) {
    console.error(error, info);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsx(InternalErrorBoundary, {
        error: this.state.error,
        params: {}
      });
    }
    return this.props.children;
  }
}
function LoaderWrapper({
  loader
}) {
  return /* @__PURE__ */ jsx(Fragment, {
    children: loader()
  });
}
const ClientOnly = ({
  loader
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return /* @__PURE__ */ jsx(ErrorBoundaryWrapper, {
    children: /* @__PURE__ */ jsx(LoaderWrapper, {
      loader
    })
  });
};
function useHmrConnection() {
  const [connected, setConnected] = useState(() => false);
  useEffect(() => {
    return;
  }, []);
  return connected;
}
const healthyResponseType = "sandbox:web:healthcheck:response";
const useHandshakeParent = () => {
  const isHmrConnected = useHmrConnection();
  useEffect(() => {
    const healthyResponse = {
      type: healthyResponseType,
      healthy: isHmrConnected,
      supportsErrorDetected: true
    };
    const handleMessage = (event) => {
      if (event.data.type === "sandbox:web:healthcheck") {
        window.parent.postMessage(healthyResponse, "*");
      }
    };
    window.addEventListener("message", handleMessage);
    window.parent.postMessage(healthyResponse, "*");
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [isHmrConnected]);
};
const waitForScreenshotReady = async () => {
  const images = Array.from(document.images);
  await Promise.all([
    // make sure custom fonts are loaded
    "fonts" in document ? document.fonts.ready : Promise.resolve(),
    ...images.map((img) => new Promise((resolve) => {
      img.crossOrigin = "anonymous";
      if (img.complete) {
        resolve(true);
        return;
      }
      img.onload = () => resolve(true);
      img.onerror = () => resolve(true);
    }))
  ]);
  await new Promise((resolve) => setTimeout(resolve, 250));
};
const useHandleScreenshotRequest = () => {
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data.type === "sandbox:web:screenshot:request") {
        try {
          await waitForScreenshotReady();
          const width = window.innerWidth;
          const aspectRatio = 16 / 9;
          const height = Math.floor(width / aspectRatio);
          const dataUrl = await toPng(document.body, {
            cacheBust: true,
            skipFonts: false,
            width,
            height,
            style: {
              // force snapshot sizing
              width: `${width}px`,
              height: `${height}px`,
              margin: "0"
            }
          });
          window.parent.postMessage({
            type: "sandbox:web:screenshot:response",
            dataUrl
          }, "*");
        } catch (error) {
          window.parent.postMessage({
            type: "sandbox:web:screenshot:error",
            error: error instanceof Error ? error.message : String(error)
          }, "*");
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
};
function Layout({
  children
}) {
  useHandshakeParent();
  useHandleScreenshotRequest();
  useDevServerHeartbeat();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location?.pathname;
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "sandbox:navigation") {
        navigate(event.data.pathname);
      }
    };
    window.addEventListener("message", handleMessage);
    window.parent.postMessage({
      type: "sandbox:web:ready"
    }, "*");
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [navigate]);
  useEffect(() => {
    if (pathname) {
      window.parent.postMessage({
        type: "sandbox:web:navigation",
        pathname
      }, "*");
    }
  }, [pathname]);
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {}), /* @__PURE__ */ jsx("script", {
        type: "module",
        src: "/src/__create/dev-error-overlay.js"
      }), /* @__PURE__ */ jsx("link", {
        rel: "icon",
        href: "/src/__create/favicon.png"
      }), LoadFontsSSR ? /* @__PURE__ */ jsx(LoadFontsSSR, {}) : null]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx(ClientOnly, {
        loader: () => children
      }), /* @__PURE__ */ jsx(Toaster, {
        position: isMobile ? "top-center" : "bottom-right"
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {}), /* @__PURE__ */ jsx("script", {
        src: "https://kit.fontawesome.com/2c15cc0cc7.js",
        crossOrigin: "anonymous",
        async: true
      })]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(SessionProvider, {
    children: /* @__PURE__ */ jsx(Outlet, {})
  });
});

const route0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ClientOnly,
  Layout,
  default: root,
  links,
  useHandleScreenshotRequest,
  useHmrConnection
}, Symbol.toStringTag, { value: 'Module' }));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1e3 * 60 * 5,
      // 5 minutes
      cacheTime: 1e3 * 60 * 30,
      // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});
function RootLayout({
  children
}) {
  return /* @__PURE__ */ jsx(QueryClientProvider, {
    client: queryClient,
    children
  });
}

const useUser = () => {
  const {
    data: session,
    status
  } = useSession();
  const id = session?.user?.id;
  const [user, setUser] = React.useState(session?.user ?? null);
  const fetchUser = React.useCallback(async session => {
    return session?.user;
  }, []);
  const refetchUser = React.useCallback(() => {
    if (process.env.NEXT_PUBLIC_CREATE_ENV === "PRODUCTION") {
      if (id) {
        fetchUser(session).then(setUser);
      } else {
        setUser(null);
      }
    }
  }, [fetchUser, id]);
  React.useEffect(refetchUser, [refetchUser]);
  if (process.env.NEXT_PUBLIC_CREATE_ENV !== "PRODUCTION") {
    return {
      user,
      data: session?.user || null,
      loading: status === 'loading',
      refetch: refetchUser
    };
  }
  return {
    user,
    data: user,
    loading: status === 'loading' || status === 'authenticated' && !user,
    refetch: refetchUser
  };
};

function HomePage() {
  const {
    data: user,
    loading: userLoading
  } = useUser();
  const [showDashboard, setShowDashboard] = useState(false);
  const [pegawai, setPegawai] = useState(null);
  const [stats, setStats] = useState(null);
  const [notifikasi, setNotifikasi] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [user, userLoading]);
  const fetchDashboardData = async () => {
    try {
      const [profileRes, statsRes, notifRes] = await Promise.all([fetch("/api/pegawai/profile"), fetch("/api/dashboard/stats"), fetch("/api/notifikasi/list")]);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setPegawai(profileData.pegawai);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifikasi(notifData.notifikasi || []);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };
  if (userLoading || loading) {
    return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "flex min-h-screen items-center justify-center bg-[#0F172A]",
      renderId: "render-222e242b",
      as: "div",
      children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "animate-pulse flex flex-col items-center gap-4",
        renderId: "render-2f886231",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "w-16 h-16 bg-blue-500/20 rounded-full border-2 border-blue-500/50 border-t-blue-500 animate-spin",
          renderId: "render-5251c254",
          as: "div"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-blue-400 font-medium tracking-widest uppercase",
          renderId: "render-2f868cc3",
          as: "div",
          children: "Memuat..."
        })]
      })
    });
  }
  if (!showDashboard) {
    return /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-[#1E40AF] via-[#3B82F6] to-[#60A5FA]",
      renderId: "render-2969ff88",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "absolute inset-0 overflow-hidden pointer-events-none opacity-20",
        renderId: "render-8d968374",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]",
          renderId: "render-f5c454d0",
          as: "div"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-300 rounded-full blur-[150px]",
          renderId: "render-1ac6438c",
          as: "div"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:32px_32px]",
          renderId: "render-703f6cb5",
          as: "div"
        }), /* @__PURE__ */ jsxs("svg", {
          className: "absolute inset-0 w-full h-full opacity-10",
          viewBox: "0 0 1000 500",
          preserveAspectRatio: "xMidYMid slice",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            d: "M150,200 Q200,150 250,200 T350,200 T450,250 T550,200 T650,250 T750,200 T850,250",
            fill: "none",
            stroke: "white",
            strokeWidth: "2",
            strokeDasharray: "5,5",
            renderId: "render-e9dc594e",
            as: "path"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            cx: "200",
            cy: "200",
            r: "2",
            fill: "white",
            renderId: "render-63222d28",
            as: "circle"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            cx: "400",
            cy: "250",
            r: "2",
            fill: "white",
            renderId: "render-77bbeb5e",
            as: "circle"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            cx: "600",
            cy: "220",
            r: "2",
            fill: "white",
            renderId: "render-594a90c9",
            as: "circle"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            cx: "800",
            cy: "270",
            r: "2",
            fill: "white",
            renderId: "render-422fbaa0",
            as: "circle"
          })]
        })]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "relative z-10 flex flex-col items-center text-center px-6 max-w-4xl animate-in fade-in zoom-in duration-700",
        renderId: "render-6affc366",
        as: "div",
        children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "mb-12 relative",
          renderId: "render-1bef0fb6",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "absolute -inset-4 bg-white/20 blur-xl rounded-full animate-pulse",
            renderId: "render-ce20ed0c",
            as: "div"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "relative w-40 h-40 md:w-48 md:h-48 bg-white rounded-full p-6 shadow-2xl flex items-center justify-center border-4 border-white/30 backdrop-blur-sm",
            renderId: "render-a56cdc64",
            as: "div",
            children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              src: "https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/",
              alt: "Logo",
              className: "w-full h-full object-contain",
              renderId: "render-01552dd4",
              as: "img"
            })
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "space-y-6",
          renderId: "render-2b65ee72",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-white text-xl md:text-2xl font-light tracking-[0.2em] uppercase",
            renderId: "render-3b74a46a",
            as: "h2",
            children: "Selamat Datang di"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex flex-col items-center gap-4",
            renderId: "render-fd220bb8",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "bg-white px-8 py-3 rounded-xl shadow-xl",
              renderId: "render-11203457",
              as: "div",
              children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "text-4xl md:text-6xl font-black tracking-tighter",
                renderId: "render-cb1ebf75",
                as: "h1",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-[#1E40AF]",
                  renderId: "render-d7a01db2",
                  as: "span",
                  children: "SIM"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-[#3B82F6]",
                  renderId: "render-3294004e",
                  as: "span",
                  children: "PEG"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "ml-2 text-gray-300 font-light",
                  renderId: "render-5db7a888",
                  as: "span",
                  children: "DIGITAL"
                })]
              })
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "text-blue-50 text-lg md:text-xl font-medium tracking-wide max-w-2xl leading-relaxed",
              renderId: "render-3c05e426",
              as: "p",
              children: ["Platform Digital Manajemen Kepegawaian Terpadu", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-white/80 text-base font-normal mt-2",
                renderId: "render-c5711f26",
                as: "span",
                children: "Dinas Pekerjaan Umum & Perumahan Rakyat Provinsi Papua Barat Daya"
              })]
            })]
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "pt-10 flex flex-col sm:flex-row gap-4 justify-center items-center",
            renderId: "render-662dc95a",
            as: "div",
            children: user ? /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                onClick: () => setShowDashboard(true),
                className: "group px-8 py-4 bg-white text-[#1E40AF] font-bold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3",
                renderId: "render-013999f9",
                as: "button",
                children: [/* @__PURE__ */ jsx(LayoutDashboard, {
                  size: 20
                }), "Masuk Ke Dashboard", /* @__PURE__ */ jsx(ArrowRight, {
                  size: 20,
                  className: "group-hover:translate-x-1 transition-transform"
                })]
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                href: "/account/logout",
                className: "px-8 py-4 bg-white/10 text-white font-medium rounded-full border border-white/30 hover:bg-white/20 transition-all backdrop-blur-md flex items-center gap-2",
                renderId: "render-3e6c1c05",
                as: "a",
                children: [/* @__PURE__ */ jsx(LogOut, {
                  size: 18
                }), "Keluar"]
              })]
            }) : /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              href: "/account/signin",
              className: "group px-12 py-4 bg-white text-[#1E40AF] font-bold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3",
              renderId: "render-39406cca",
              as: "a",
              children: ["Masuk Ke Sistem", /* @__PURE__ */ jsx(ArrowRight, {
                size: 20,
                className: "group-hover:translate-x-1 transition-transform"
              })]
            })
          })]
        })]
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "absolute bottom-8 text-white/50 text-xs tracking-widest uppercase font-medium",
        renderId: "render-641dd3c6",
        as: "div",
        children: "© 2026 SIMPEG DIGITAL · PAPUA BARAT DAYA"
      })]
    });
  }
  return /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
    className: "min-h-screen bg-[#F8FAFC]",
    style: {
      fontFamily: "Inter, -apple-system, sans-serif"
    },
    renderId: "render-ea03dc42",
    as: "div",
    children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "bg-white border-b border-[#E2E8F0] sticky top-0 z-50",
      renderId: "render-51526da2",
      as: "div",
      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "max-w-7xl mx-auto px-6 py-4",
        renderId: "render-3101b677",
        as: "div",
        children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex items-center justify-between",
          renderId: "render-bb0cc8f0",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-4",
            renderId: "render-0f098043",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "cursor-pointer hover:opacity-80 transition-opacity",
              onClick: () => setShowDashboard(false),
              renderId: "render-4ace2652",
              as: "div",
              children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                src: "https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/",
                alt: "Logo",
                className: "h-10 w-10 object-contain",
                renderId: "render-d577db2c",
                as: "img"
              })
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-385328b8",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-lg font-bold text-[#0F172A] tracking-tight",
                renderId: "render-04b1ffb2",
                as: "h1",
                children: "SIMPEG DIGITAL"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-[10px] text-[#64748B] font-bold uppercase tracking-wider",
                renderId: "render-e661fb70",
                as: "p",
                children: "Provinsi Papua Barat Daya"
              })]
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-4",
            renderId: "render-389d1cbc",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "relative p-2 hover:bg-[#F1F5F9] rounded-xl transition-colors",
              renderId: "render-f324795b",
              as: "button",
              children: [/* @__PURE__ */ jsx(Bell, {
                size: 20,
                className: "text-[#64748B]"
              }), notifikasi.filter((n) => !n.is_read).length > 0 && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white",
                renderId: "render-980c7022",
                as: "span"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "flex items-center gap-3 pl-4 border-l border-[#E2E8F0]",
              renderId: "render-f96a9e1c",
              as: "div",
              children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "text-right hidden sm:block",
                renderId: "render-2310967e",
                as: "div",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-sm font-semibold text-[#0F172A]",
                  renderId: "render-2550ce53",
                  as: "p",
                  children: pegawai?.nama_lengkap || user?.name
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-[10px] font-bold text-blue-600 uppercase tracking-tighter",
                  renderId: "render-7dcf9f83",
                  as: "p",
                  children: pegawai?.role || "USER"
                })]
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold",
                renderId: "render-ae022b77",
                as: "div",
                children: (pegawai?.nama_lengkap || user?.name || "U").charAt(0)
              })]
            })]
          })]
        })
      })
    }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "bg-white border-b border-[#E2E8F0]",
      renderId: "render-bb95590c",
      as: "div",
      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "max-w-7xl mx-auto px-6",
        renderId: "render-77f41fa8",
        as: "div",
        children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "flex gap-8 overflow-x-auto no-scrollbar",
          renderId: "render-a887740d",
          as: "nav",
          children: [{
            label: "Dashboard",
            href: "/",
            active: true
          }, {
            label: "Data Pegawai",
            href: "/pegawai"
          }, {
            label: "SKP",
            href: "/skp"
          }, {
            label: "KGB",
            href: "/kgb"
          }, {
            label: "Kenaikan Pangkat",
            href: "/kenaikan-pangkat"
          }, {
            label: "Cuti & Izin",
            href: "/cuti"
          }, {
            label: "Digital Dossier",
            href: "/dossier"
          }].map((item) => /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: item.href,
            className: `py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${item.active ? "border-blue-600 text-blue-600" : "border-transparent text-[#64748B] hover:text-[#0F172A]"}`,
            renderId: "render-d1bb8a5f",
            as: "a",
            children: item.label
          }, item.label))
        })
      })
    }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "max-w-7xl mx-auto px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500",
      renderId: "render-0f609812",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10",
        renderId: "render-e36d899f",
        as: "div",
        children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-57a93964",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "text-3xl font-black text-[#0F172A] tracking-tight mb-2",
            renderId: "render-ecf9ef1b",
            as: "h2",
            children: ["Halo, ", pegawai?.nama_lengkap?.split(" ")[0] || user?.name, "!"]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-3",
            renderId: "render-51d8391a",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider",
              renderId: "render-e83f731b",
              as: "span",
              children: pegawai?.jabatan || "Pegawai"
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "text-xs text-[#64748B] font-medium",
              renderId: "render-ae9413f7",
              as: "span",
              children: pegawai?.unit_kerja || "Dinas PUPR"
            })]
          })]
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-right",
          renderId: "render-0998f597",
          as: "div",
          children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-xs text-[#64748B] font-bold uppercase tracking-widest",
            renderId: "render-f384d035",
            as: "p",
            children: (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric"
            })
          })
        })]
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10",
        renderId: "render-3c1c7d1e",
        as: "div",
        children: [{
          label: "Total Pegawai",
          value: stats?.totalPegawai || 0,
          icon: Users,
          color: "blue"
        }, {
          label: "KGB Bulan Ini",
          value: stats?.kgbBulanIni || 0,
          icon: Calendar,
          color: "orange"
        }, {
          label: "Usulan Kenaikan Pangkat",
          value: stats?.usulanKP || 0,
          icon: Award,
          color: "emerald"
        }, {
          label: "SKP Belum Submits",
          value: stats?.skpBelumSubmit || 0,
          icon: FileText,
          color: "rose"
        }].map((stat) => /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-xl hover:-translate-y-1 transition-all group",
          renderId: "render-1157b099",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: `w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`,
            renderId: "render-7e462628",
            as: "div",
            children: /* @__PURE__ */ jsx(stat.icon, {
              size: 24,
              className: `text-${stat.color}-600`
            })
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1",
            renderId: "render-11947efb",
            as: "p",
            children: stat.label
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-3xl font-black text-[#0F172A]",
            renderId: "render-db744346",
            as: "p",
            children: stat.value
          })]
        }, stat.label))
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
        renderId: "render-ce0e9e3b",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "lg:col-span-2",
          renderId: "render-d61fe860",
          as: "div",
          children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm",
            renderId: "render-5ce27621",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "flex items-center justify-between mb-8",
              renderId: "render-2eb37cb0",
              as: "div",
              children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "flex items-center gap-3",
                renderId: "render-e9d8b3d7",
                as: "div",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "w-2 h-6 bg-blue-600 rounded-full",
                  renderId: "render-63aea8d0",
                  as: "div"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-xl font-bold text-[#0F172A]",
                  renderId: "render-3c81c144",
                  as: "h3",
                  children: "Notifikasi & Pengingat"
                })]
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                href: "/notifikasi",
                className: "text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest",
                renderId: "render-1e3f5a79",
                as: "a",
                children: "Lihat Semua"
              })]
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "space-y-4",
              renderId: "render-ab3016f9",
              as: "div",
              children: notifikasi.length === 0 ? /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "flex flex-col items-center justify-center py-12 opacity-40",
                renderId: "render-ccbaca92",
                as: "div",
                children: [/* @__PURE__ */ jsx(AlertCircle, {
                  size: 48,
                  className: "mb-4"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-sm font-bold uppercase tracking-widest",
                  renderId: "render-0477f370",
                  as: "p",
                  children: "Tidak ada notifikasi"
                })]
              }) : notifikasi.slice(0, 5).map((notif) => /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "group flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-blue-100 hover:bg-blue-50/50 transition-all",
                renderId: "render-35408e70",
                as: "div",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform",
                  renderId: "render-f6ad3687",
                  as: "div",
                  children: /* @__PURE__ */ jsx(AlertCircle, {
                    size: 18,
                    className: "text-blue-600"
                  })
                }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                  className: "flex-1 min-w-0",
                  renderId: "render-1e2c6e8d",
                  as: "div",
                  children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    className: "text-sm font-bold text-[#0F172A] mb-1",
                    renderId: "render-6f2c1a1d",
                    as: "p",
                    children: notif.judul
                  }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    className: "text-xs text-[#64748B] leading-relaxed line-clamp-2",
                    renderId: "render-a0aaad2f",
                    as: "p",
                    children: notif.pesan
                  }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    className: "text-[10px] font-bold text-[#94A3B8] mt-2 uppercase tracking-tighter",
                    renderId: "render-473b3edc",
                    as: "p",
                    children: new Date(notif.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })
                  })]
                }), !notif.is_read && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2",
                  renderId: "render-da429f63",
                  as: "div"
                })]
              }, notif.id))
            })]
          })
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "lg:col-span-1",
          renderId: "render-fef7a983",
          as: "div",
          children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm",
            renderId: "render-a6f31211",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "flex items-center gap-3 mb-8",
              renderId: "render-45838889",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "w-2 h-6 bg-orange-500 rounded-full",
                renderId: "render-c79061a1",
                as: "div"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xl font-bold text-[#0F172A]",
                renderId: "render-780afca6",
                as: "h3",
                children: "Menu Cepat"
              })]
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "grid grid-cols-1 gap-3",
              renderId: "render-3606bce6",
              as: "div",
              children: [{
                label: "Tambah Pegawai",
                icon: Users,
                href: "/pegawai/tambah"
              }, {
                label: "Upload SKP",
                icon: FileText,
                href: "/skp/upload"
              }, {
                label: "Ajukan Cuti",
                icon: Calendar,
                href: "/cuti/ajukan"
              }, {
                label: "Upload Dokumen",
                icon: TrendingUp,
                href: "/dossier/upload"
              }].map((action) => /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                href: action.href,
                className: "flex items-center gap-4 p-4 rounded-xl border border-[#E2E8F0] hover:border-blue-600 hover:bg-blue-50 hover:shadow-md transition-all group",
                renderId: "render-e1550517",
                as: "a",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#64748B] group-hover:bg-white group-hover:text-blue-600 transition-colors",
                  renderId: "render-d11b5b8c",
                  as: "div",
                  children: /* @__PURE__ */ jsx(action.icon, {
                    size: 20
                  })
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-sm font-bold text-[#334155] group-hover:text-blue-700",
                  renderId: "render-def6513d",
                  as: "span",
                  children: action.label
                })]
              }, action.label))
            })]
          })
        })]
      })]
    })]
  });
}

const page$i = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(HomePage, {
      ...props
    })
  });
});

const route1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$i
}, Symbol.toStringTag, { value: 'Module' }));

function isDevIframe() {
  try {
    return typeof window !== 'undefined' && window.self !== window.top;
  } catch {
    return true;
  }
}
function devSocialShim(provider, callbackUrl) {
  const params = new URLSearchParams({
    provider
  });
  if (callbackUrl) params.set('callbackUrl', callbackUrl);
  window.location.href = '/__create/social-dev-shim?' + params;
}
function useAuth() {
  const callbackUrl = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('callbackUrl') : null;
  const signInWithCredentials = useCallback(options => {
    return signIn("credentials-signin", {
      ...options,
      callbackUrl: callbackUrl ?? options.callbackUrl
    });
  }, [callbackUrl]);
  const signUpWithCredentials = useCallback(options => {
    return signIn("credentials-signup", {
      ...options,
      callbackUrl: callbackUrl ?? options.callbackUrl
    });
  }, [callbackUrl]);
  const signInWithGoogle = useCallback(options => {
    const cb = callbackUrl ?? options?.callbackUrl;
    if (isDevIframe()) return devSocialShim("google", cb);
    return signIn("google", {
      ...options,
      callbackUrl: cb
    });
  }, [callbackUrl]);
  const signInWithFacebook = useCallback(options => {
    const cb = options?.callbackUrl;
    if (isDevIframe()) return devSocialShim("facebook", cb);
    return signIn("facebook", options);
  }, []);
  const signInWithTwitter = useCallback(options => {
    const cb = options?.callbackUrl;
    if (isDevIframe()) return devSocialShim("twitter", cb);
    return signIn("twitter", options);
  }, []);
  const signInWithApple = useCallback(options => {
    const cb = callbackUrl ?? options?.callbackUrl;
    if (isDevIframe()) return devSocialShim("apple", cb);
    return signIn("apple", {
      ...options,
      callbackUrl: cb
    });
  }, [callbackUrl]);
  return {
    signInWithCredentials,
    signUpWithCredentials,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    signInWithApple,
    signOut
  };
}

function LogoutPage() {
  const {
    signOut
  } = useAuth();
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/account/signin",
      redirect: true
    });
  };
  return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
    className: "flex min-h-screen w-full items-center justify-center bg-[#F9FAFB]",
    style: {
      fontFamily: "Inter, -apple-system, sans-serif"
    },
    renderId: "render-69e6d676",
    as: "div",
    children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "w-full max-w-md bg-white rounded-xl border border-[#E5E7EB] p-8",
      renderId: "render-0a7664e2",
      as: "div",
      children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "flex items-center justify-center mb-8",
        renderId: "render-667749ce",
        as: "div",
        children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          src: "https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/",
          alt: "Logo Papua Barat Daya",
          className: "h-20 w-20 object-contain",
          renderId: "render-c78b99d0",
          as: "img"
        })
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "text-2xl font-semibold text-[#111827] tracking-tight text-center mb-2",
        renderId: "render-a071048c",
        as: "h1",
        children: "Keluar dari Sistem"
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "text-sm text-[#6B7280] text-center mb-8",
        renderId: "render-6adfd1e1",
        as: "p",
        children: "Anda yakin ingin keluar dari S-Kepegawaian?"
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        onClick: handleSignOut,
        className: "w-full rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2",
        renderId: "render-c95bb688",
        as: "button",
        children: "Keluar"
      })]
    })
  });
}

const page$h = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(LogoutPage, {
      ...props
    })
  });
});

const route2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$h
}, Symbol.toStringTag, { value: 'Module' }));

function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    signInWithCredentials
  } = useAuth();
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email || !password) {
      setError("Harap isi semua field");
      setLoading(false);
      return;
    }
    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/",
        redirect: true
      });
    } catch (err) {
      setError("Email atau password salah");
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
    className: "flex min-h-screen w-full items-center justify-center bg-[#F9FAFB]",
    style: {
      fontFamily: "Inter, -apple-system, sans-serif"
    },
    renderId: "render-9a66fb06",
    as: "div",
    children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      noValidate: true,
      onSubmit,
      className: "w-full max-w-md bg-white rounded-xl border border-[#E5E7EB] p-8",
      renderId: "render-cee126c3",
      as: "form",
      children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "flex items-center justify-center mb-8",
        renderId: "render-a1a36ec2",
        as: "div",
        children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          src: "https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/",
          alt: "Logo Papua Barat Daya",
          className: "h-20 w-20 object-contain",
          renderId: "render-9c808c36",
          as: "img"
        })
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "text-2xl font-semibold text-[#111827] tracking-tight text-center mb-2",
        renderId: "render-b787b0d6",
        as: "h1",
        children: "S-Kepegawaian"
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "text-sm text-[#6B7280] text-center mb-8",
        renderId: "render-01baab1a",
        as: "p",
        children: "Dinas PUPR Provinsi Papua Barat Daya"
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "space-y-5",
        renderId: "render-ce9a1322",
        as: "div",
        children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "space-y-2",
          renderId: "render-75d6cabf",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#111827]",
            renderId: "render-4f71eb90",
            as: "label",
            children: "Email"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            required: true,
            name: "email",
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "Masukkan email Anda",
            className: "w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2",
            renderId: "render-c7273309",
            as: "input"
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "space-y-2",
          renderId: "render-13074981",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#111827]",
            renderId: "render-0b2529ef",
            as: "label",
            children: "Password"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            required: true,
            name: "password",
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            className: "w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2",
            placeholder: "Masukkan password Anda",
            renderId: "render-3141460d",
            as: "input"
          })]
        }), error && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600",
          renderId: "render-36962e42",
          as: "div",
          children: error
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          type: "submit",
          disabled: loading,
          className: "w-full rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:opacity-50",
          renderId: "render-c28539eb",
          as: "button",
          children: loading ? "Memuat..." : "Masuk"
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "text-center text-xs text-[#6B7280]",
          renderId: "render-5968e509",
          as: "p",
          children: ["Belum punya akun?", " ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: "/account/signup",
            className: "text-[#2563EB] hover:text-[#1D4ED8] font-medium",
            renderId: "render-c9fc3ba6",
            as: "a",
            children: "Daftar di sini"
          })]
        })]
      })]
    })
  });
}

const page$g = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(SignInPage, {
      ...props
    })
  });
});

const route3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$g
}, Symbol.toStringTag, { value: 'Module' }));

function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const {
    signUpWithCredentials
  } = useAuth();
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email || !password || !name) {
      setError("Harap isi semua field");
      setLoading(false);
      return;
    }
    try {
      await signUpWithCredentials({
        email,
        password,
        name,
        callbackUrl: "/onboarding",
        redirect: true
      });
    } catch (err) {
      setError("Email sudah terdaftar atau terjadi kesalahan");
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
    className: "flex min-h-screen w-full items-center justify-center bg-[#F9FAFB]",
    style: {
      fontFamily: "Inter, -apple-system, sans-serif"
    },
    renderId: "render-92d91830",
    as: "div",
    children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      noValidate: true,
      onSubmit,
      className: "w-full max-w-md bg-white rounded-xl border border-[#E5E7EB] p-8",
      renderId: "render-b68b3cd0",
      as: "form",
      children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "flex items-center justify-center mb-8",
        renderId: "render-b6e2f284",
        as: "div",
        children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          src: "https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/",
          alt: "Logo Papua Barat Daya",
          className: "h-20 w-20 object-contain",
          renderId: "render-7bb52040",
          as: "img"
        })
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "text-2xl font-semibold text-[#111827] tracking-tight text-center mb-2",
        renderId: "render-5ab7f0f6",
        as: "h1",
        children: "Daftar Akun Baru"
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "text-sm text-[#6B7280] text-center mb-8",
        renderId: "render-b68bea4a",
        as: "p",
        children: "S-Kepegawaian Dinas PUPR"
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "space-y-5",
        renderId: "render-58d18db4",
        as: "div",
        children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "space-y-2",
          renderId: "render-79f15e4c",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#111827]",
            renderId: "render-e8956f20",
            as: "label",
            children: "Nama Lengkap"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            required: true,
            name: "name",
            type: "text",
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "Masukkan nama lengkap Anda",
            className: "w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2",
            renderId: "render-5adfc9a5",
            as: "input"
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "space-y-2",
          renderId: "render-bb5481f4",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#111827]",
            renderId: "render-d5dc1cda",
            as: "label",
            children: "Email"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            required: true,
            name: "email",
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "Masukkan email Anda",
            className: "w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2",
            renderId: "render-4ce140ba",
            as: "input"
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "space-y-2",
          renderId: "render-54f34075",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#111827]",
            renderId: "render-b3bda578",
            as: "label",
            children: "Password"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            required: true,
            name: "password",
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            className: "w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2",
            placeholder: "Buat password Anda",
            renderId: "render-a165c23e",
            as: "input"
          })]
        }), error && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600",
          renderId: "render-5a50b40b",
          as: "div",
          children: error
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          type: "submit",
          disabled: loading,
          className: "w-full rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:opacity-50",
          renderId: "render-38130831",
          as: "button",
          children: loading ? "Memuat..." : "Daftar"
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "text-center text-xs text-[#6B7280]",
          renderId: "render-0c129896",
          as: "p",
          children: ["Sudah punya akun?", " ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: "/account/signin",
            className: "text-[#2563EB] hover:text-[#1D4ED8] font-medium",
            renderId: "render-ade1aa61",
            as: "a",
            children: "Masuk di sini"
          })]
        })]
      })]
    })
  });
}

const page$f = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(SignUpPage, {
      ...props
    })
  });
});

const route4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$f
}, Symbol.toStringTag, { value: 'Module' }));

const NAV_ITEMS = [{
  href: "/",
  label: "Dashboard"
}, {
  href: "/pegawai",
  label: "Data Pegawai"
}, {
  href: "/skp",
  label: "SKP"
}, {
  href: "/kgb",
  label: "KGB"
}, {
  href: "/kenaikan-pangkat",
  label: "Kenaikan Pangkat"
}, {
  href: "/cuti",
  label: "Cuti & Izin"
}, {
  href: "/dossier",
  label: "Digital Dossier"
}];
function AppLayout({
  children,
  pegawai,
  activeHref,
  notifCount = 0
}) {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : activeHref;
  return /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
    className: "min-h-screen bg-[#F9FAFB]",
    style: {
      fontFamily: "Inter, -apple-system, sans-serif"
    },
    renderId: "render-6992500e",
    as: "div",
    children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "bg-white border-b border-[#E5E7EB] sticky top-0 z-50",
      renderId: "render-f5f3c6cd",
      as: "div",
      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "max-w-7xl mx-auto px-6 py-4",
        renderId: "render-a027616f",
        as: "div",
        children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex items-center justify-between",
          renderId: "render-bc58a41b",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-4",
            renderId: "render-06ce4716",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              src: "https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/",
              alt: "Logo PUPR Papua Barat Daya",
              className: "h-12 w-12 object-contain",
              renderId: "render-1139b5d8",
              as: "img"
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-a25613c9",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-lg font-semibold text-[#111827] tracking-tight",
                renderId: "render-61dc9753",
                as: "h1",
                children: "S-Kepegawaian"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-208eb6ed",
                as: "p",
                children: "Dinas PUPR Papua Barat Daya"
              })]
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-4",
            renderId: "render-a69c067a",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              href: "/notifikasi",
              className: "relative p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors",
              renderId: "render-24ffee81",
              as: "a",
              children: [/* @__PURE__ */ jsx(Bell, {
                size: 20,
                className: "text-[#6B7280]"
              }), notifCount > 0 && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "absolute top-1 right-1 w-2 h-2 bg-[#EA580C] rounded-full",
                renderId: "render-13396d4b",
                as: "span"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "flex items-center gap-3 pl-4 border-l border-[#E5E7EB]",
              renderId: "render-e969ca54",
              as: "div",
              children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "text-right",
                renderId: "render-a7f7c0d3",
                as: "div",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-sm font-medium text-[#111827]",
                  renderId: "render-365f49c5",
                  as: "p",
                  children: pegawai?.nama_lengkap || "Pengguna"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-xs text-[#6B7280]",
                  renderId: "render-00b5bc2a",
                  as: "p",
                  children: pegawai?.role === "admin" ? "Administrator" : pegawai?.role === "pimpinan" ? "Pimpinan" : "Pegawai"
                })]
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                href: "/account/logout",
                className: "text-xs text-[#6B7280] hover:text-[#2563EB]",
                renderId: "render-2b1768e5",
                as: "a",
                children: "Keluar"
              })]
            })]
          })]
        })
      })
    }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "bg-white border-b border-[#E5E7EB]",
      renderId: "render-53a9253d",
      as: "div",
      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "max-w-7xl mx-auto px-6 overflow-x-auto",
        renderId: "render-1b62d89b",
        as: "div",
        children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "flex gap-0 min-w-max",
          renderId: "render-5cd37bc7",
          as: "nav",
          children: NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.href || item.href !== "/" && currentPath?.startsWith(item.href);
            return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              href: item.href,
              className: `py-3 px-4 border-b-2 text-sm whitespace-nowrap transition-colors -mb-[1px] ${isActive ? "border-[#2563EB] font-medium text-[#111827]" : "border-transparent text-[#6B7280] hover:text-[#111827] hover:border-[#E5E7EB]"}`,
              renderId: "render-a016e4db",
              as: "a",
              children: item.label
            }, item.href);
          })
        })
      })
    }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "max-w-7xl mx-auto px-6 py-8",
      renderId: "render-06b30cf8",
      as: "div",
      children
    })]
  });
}

const JENIS_CUTI_LABEL = {
  cuti_tahunan: "Cuti Tahunan",
  cuti_besar: "Cuti Besar",
  cuti_sakit: "Cuti Sakit",
  cuti_melahirkan: "Cuti Melahirkan",
  cuti_alasan_penting: "Cuti Alasan Penting",
  cltn: "CLTN",
  izin: "Izin"
};
const STATUS_CONFIG$3 = {
  menunggu: {
    label: "Menunggu",
    className: "bg-[#FEF3C7] text-[#B45309]",
    icon: Clock
  },
  disetujui: {
    label: "Disetujui",
    className: "bg-[#ECFDF5] text-[#059669]",
    icon: CheckCircle2
  },
  ditolak: {
    label: "Ditolak",
    className: "bg-[#FEF2F2] text-[#DC2626]",
    icon: XCircle
  },
  dibatalkan: {
    label: "Dibatalkan",
    className: "bg-[#F3F4F6] text-[#6B7280]",
    icon: AlertCircle
  }
};
function CutiPage() {
  const {
    data: user,
    loading: userLoading
  } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [cutiList, setCutiList] = useState([]);
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
      return;
    }
    if (user) fetchProfile();
  }, [user, userLoading]);
  useEffect(() => {
    if (pegawai) fetchCuti();
  }, [pegawai, filterStatus]);
  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) {
      window.location.href = "/onboarding";
      return;
    }
    if (res.ok) {
      const d = await res.json();
      setPegawai(d.pegawai);
    }
  };
  const fetchCuti = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      const res = await fetch(`/api/cuti/list?${params}`);
      if (res.ok) {
        const d = await res.json();
        setCutiList(d.cuti || []);
        setSaldo(d.saldo);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleApproval = async (id, status) => {
    const catatan = status === "ditolak" ? prompt("Alasan penolakan:") : "";
    if (status === "ditolak" && catatan === null) return;
    await fetch(`/api/cuti/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status,
        catatan_atasan: catatan
      })
    });
    fetchCuti();
  };
  if (userLoading || !pegawai) return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
    className: "flex min-h-screen items-center justify-center bg-[#F9FAFB]",
    renderId: "render-0b4b82b6",
    as: "div",
    children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "text-sm text-[#6B7280]",
      renderId: "render-406dd40b",
      as: "div",
      children: "Memuat..."
    })
  });
  return /* @__PURE__ */ jsxs(AppLayout, {
    pegawai,
    activeHref: "/cuti",
    children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "flex items-center justify-between mb-6",
      renderId: "render-bf5a6faf",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        renderId: "render-f375b0af",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-2xl font-semibold text-[#111827] tracking-tight mb-1",
          renderId: "render-6b620c87",
          as: "h2",
          children: "Cuti & Izin"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#6B7280]",
          renderId: "render-017e0ef9",
          as: "p",
          children: "Kelola pengajuan cuti dan izin pegawai"
        })]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        href: "/cuti/ajukan",
        className: "inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors",
        renderId: "render-28d23bf2",
        as: "a",
        children: [/* @__PURE__ */ jsx(Plus, {
          size: 16
        }), " Ajukan Cuti"]
      })]
    }), pegawai.role === "pegawai" && saldo && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6",
      renderId: "render-a9ebb041",
      as: "div",
      children: [{
        label: "Saldo Tahunan",
        value: saldo.saldo_tahunan ?? 0,
        unit: "hari",
        color: "bg-[#EFF6FF] text-[#2563EB]"
      }, {
        label: "Saldo Besar",
        value: saldo.saldo_besar ?? 0,
        unit: "hari",
        color: "bg-[#F5F3FF] text-[#7C3AED]"
      }, {
        label: "Diambil Tahun Ini",
        value: saldo.digunakan_tahun_ini ?? 0,
        unit: "hari",
        color: "bg-[#FEF3C7] text-[#B45309]"
      }, {
        label: "Tahun",
        value: saldo.tahun ?? (/* @__PURE__ */ new Date()).getFullYear(),
        unit: "",
        color: "bg-[#F3F4F6] text-[#374151]"
      }].map((card) => /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "bg-white rounded-xl border border-[#E5E7EB] p-4",
        renderId: "render-fd9a113b",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-xs text-[#6B7280] mb-1",
          renderId: "render-52267fb7",
          as: "p",
          children: card.label
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: `text-2xl font-bold ${card.color.split(" ")[1]}`,
          renderId: "render-2279c25d",
          as: "p",
          children: [card.value, " ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-sm font-normal text-[#6B7280]",
            renderId: "render-e8906cdc",
            as: "span",
            children: card.unit
          })]
        })]
      }, card.label))
    }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "bg-white rounded-xl border border-[#E5E7EB] p-4 mb-6 flex items-center gap-4",
      renderId: "render-3f4fc152",
      as: "div",
      children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "text-sm text-[#6B7280]",
        renderId: "render-85939547",
        as: "label",
        children: "Status:"
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        value: filterStatus,
        onChange: (e) => setFilterStatus(e.target.value),
        className: "px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
        renderId: "render-1fd5f344",
        as: "select",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          value: "",
          renderId: "render-4329d057",
          as: "option",
          children: "Semua Status"
        }), Object.entries(STATUS_CONFIG$3).map(([v, c]) => /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          value: v,
          renderId: "render-5adace95",
          as: "option",
          children: c.label
        }, v))]
      })]
    }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "bg-white rounded-xl border border-[#E5E7EB] overflow-hidden",
      renderId: "render-d82abb54",
      as: "div",
      children: loading ? /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "px-4 py-12 text-center text-sm text-[#6B7280]",
        renderId: "render-e60d5376",
        as: "div",
        children: "Memuat data..."
      }) : cutiList.length === 0 ? /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "px-4 py-16 text-center",
        renderId: "render-43dea3af",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4",
          renderId: "render-6a873a9a",
          as: "div",
          children: /* @__PURE__ */ jsx(Calendar, {
            size: 32,
            className: "text-[#9CA3AF]"
          })
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm font-medium text-[#111827] mb-1",
          renderId: "render-36f1092c",
          as: "p",
          children: "Belum ada pengajuan cuti"
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          href: "/cuti/ajukan",
          className: "inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#2563EB] text-white text-sm rounded-lg hover:bg-[#1D4ED8]",
          renderId: "render-7e9c3b01",
          as: "a",
          children: [/* @__PURE__ */ jsx(Plus, {
            size: 16
          }), " Ajukan Cuti Sekarang"]
        })]
      }) : /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "overflow-x-auto",
        renderId: "render-e5058471",
        as: "div",
        children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "w-full",
          renderId: "render-6abd7fcf",
          as: "table",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            renderId: "render-ac823395",
            as: "thead",
            children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "bg-[#F9FAFB] border-b border-[#E5E7EB]",
              renderId: "render-0a397d34",
              as: "tr",
              children: [pegawai.role !== "pegawai" && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase",
                renderId: "render-1de7c4e2",
                as: "th",
                children: "Pegawai"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase",
                renderId: "render-88a3ab8a",
                as: "th",
                children: "Jenis"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase",
                renderId: "render-352867dc",
                as: "th",
                children: "Tanggal Mulai"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase",
                renderId: "render-6a4e65f3",
                as: "th",
                children: "Selesai"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase",
                renderId: "render-98c571e2",
                as: "th",
                children: "Hari"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase",
                renderId: "render-90fb827a",
                as: "th",
                children: "Status"
              }), (pegawai.role === "admin" || pegawai.role === "pimpinan") && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase",
                renderId: "render-f37043ea",
                as: "th",
                children: "Aksi"
              })]
            })
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "divide-y divide-[#E5E7EB]",
            renderId: "render-bdab2776",
            as: "tbody",
            children: cutiList.map((c) => {
              const conf = STATUS_CONFIG$3[c.status] || STATUS_CONFIG$3.menunggu;
              const Icon = conf.icon;
              return /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "hover:bg-[#F9FAFB] transition-colors",
                renderId: "render-7a184338",
                as: "tr",
                children: [pegawai.role !== "pegawai" && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                  className: "px-4 py-3",
                  renderId: "render-9e0d71d7",
                  as: "td",
                  children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    className: "text-sm font-medium text-[#111827]",
                    renderId: "render-ed4c583a",
                    as: "p",
                    children: c.nama_lengkap
                  }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    className: "text-xs text-[#6B7280]",
                    renderId: "render-5e791ff9",
                    as: "p",
                    children: c.jabatan
                  })]
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#111827]",
                  renderId: "render-bed81e45",
                  as: "td",
                  children: JENIS_CUTI_LABEL[c.jenis_cuti] || c.jenis_cuti
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#6B7280]",
                  renderId: "render-d229426a",
                  as: "td",
                  children: new Date(c.tanggal_mulai).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#6B7280]",
                  renderId: "render-a4ea4458",
                  as: "td",
                  children: new Date(c.tanggal_selesai).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })
                }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm font-semibold text-[#111827]",
                  renderId: "render-82d57a66",
                  as: "td",
                  children: [c.jumlah_hari, " hr"]
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3",
                  renderId: "render-4e8f9b53",
                  as: "td",
                  children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                    className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${conf.className}`,
                    renderId: "render-6eb722b9",
                    as: "span",
                    children: [/* @__PURE__ */ jsx(Icon, {
                      size: 12
                    }), conf.label]
                  })
                }), (pegawai.role === "admin" || pegawai.role === "pimpinan") && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3",
                  renderId: "render-f8055b3e",
                  as: "td",
                  children: c.status === "menunggu" && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                    className: "flex gap-2",
                    renderId: "render-3357c289",
                    as: "div",
                    children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                      onClick: () => handleApproval(c.id, "disetujui"),
                      className: "px-3 py-1 bg-[#059669] text-white text-xs rounded-md hover:bg-[#047857] transition-colors",
                      renderId: "render-02e6b8cc",
                      as: "button",
                      children: "Setujui"
                    }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                      onClick: () => handleApproval(c.id, "ditolak"),
                      className: "px-3 py-1 bg-[#DC2626] text-white text-xs rounded-md hover:bg-[#B91C1C] transition-colors",
                      renderId: "render-1d53eeea",
                      as: "button",
                      children: "Tolak"
                    })]
                  })
                })]
              }, c.id);
            })
          })]
        })
      })
    })]
  });
}

const page$e = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(CutiPage, {
      ...props
    })
  });
});

const route5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$e
}, Symbol.toStringTag, { value: 'Module' }));

const JENIS_CUTI = [{
  value: "cuti_tahunan",
  label: "Cuti Tahunan"
}, {
  value: "cuti_besar",
  label: "Cuti Besar"
}, {
  value: "cuti_sakit",
  label: "Cuti Sakit"
}, {
  value: "cuti_melahirkan",
  label: "Cuti Melahirkan"
}, {
  value: "cuti_alasan_penting",
  label: "Cuti Alasan Penting"
}, {
  value: "cltn",
  label: "Cuti di Luar Tanggungan Negara (CLTN)"
}, {
  value: "izin",
  label: "Izin"
}];
function CutiAjukanPage() {
  const {
    data: user,
    loading: userLoading
  } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [saldo, setSaldo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    jenis_cuti: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    alasan: "",
    alamat_selama_cuti: "",
    telepon_selama_cuti: ""
  });
  const jumlahHari = form.tanggal_mulai && form.tanggal_selesai ? Math.ceil((new Date(form.tanggal_selesai) - new Date(form.tanggal_mulai)) / (1e3 * 60 * 60 * 24)) + 1 : 0;
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
      return;
    }
    if (user) fetchProfile();
  }, [user, userLoading]);
  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) {
      window.location.href = "/onboarding";
      return;
    }
    if (res.ok) {
      const d = await res.json();
      setPegawai(d.pegawai);
      const saldoRes = await fetch("/api/cuti/list");
      if (saldoRes.ok) {
        const sd = await saldoRes.json();
        setSaldo(sd.saldo);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (jumlahHari <= 0) {
      setError("Tanggal tidak valid");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/cuti/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengajukan cuti");
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/cuti";
      }, 2e3);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  if (userLoading || !pegawai) return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
    className: "flex min-h-screen items-center justify-center bg-[#F9FAFB]",
    renderId: "render-af641b15",
    as: "div",
    children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "text-sm text-[#6B7280]",
      renderId: "render-ea56272e",
      as: "div",
      children: "Memuat..."
    })
  });
  return /* @__PURE__ */ jsx(AppLayout, {
    pegawai,
    activeHref: "/cuti",
    children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "max-w-2xl mx-auto",
      renderId: "render-b778933b",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "flex items-center gap-3 mb-6",
        renderId: "render-e911050c",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          href: "/cuti",
          className: "p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors",
          renderId: "render-a2144ba1",
          as: "a",
          children: /* @__PURE__ */ jsx(ArrowLeft, {
            size: 20,
            className: "text-[#6B7280]"
          })
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-c81a8ad6",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-2xl font-semibold text-[#111827] tracking-tight",
            renderId: "render-98f40b9c",
            as: "h2",
            children: "Formulir Pengajuan Cuti"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-sm text-[#6B7280]",
            renderId: "render-a849d7d3",
            as: "p",
            children: "Isi formulir pengajuan cuti atau izin"
          })]
        })]
      }), success && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "mb-6 p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-3",
        renderId: "render-5ef9038c",
        as: "div",
        children: [/* @__PURE__ */ jsx(Check, {
          size: 20,
          className: "text-[#059669]"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#059669] font-medium",
          renderId: "render-b52a7b3a",
          as: "p",
          children: "Cuti berhasil diajukan! Menunggu persetujuan atasan."
        })]
      }), error && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "mb-6 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-center gap-3",
        renderId: "render-3f986296",
        as: "div",
        children: [/* @__PURE__ */ jsx(X, {
          size: 20,
          className: "text-[#DC2626]"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#DC2626]",
          renderId: "render-baaa0369",
          as: "p",
          children: error
        })]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        onSubmit: handleSubmit,
        className: "bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5",
        renderId: "render-2a2d7841",
        as: "form",
        children: [saldo && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex items-center gap-3 p-3 bg-[#EFF6FF] rounded-lg",
          renderId: "render-7daf945b",
          as: "div",
          children: [/* @__PURE__ */ jsx(Info, {
            size: 16,
            className: "text-[#2563EB] flex-shrink-0"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "text-sm text-[#1D4ED8]",
            renderId: "render-8a1f0efd",
            as: "p",
            children: ["Saldo cuti tahunan Anda: ", /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-a2005ed1",
              as: "strong",
              children: [saldo.saldo_tahunan ?? 0, " hari"]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-5467ac2a",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#374151] mb-1.5",
            renderId: "render-85adcd19",
            as: "label",
            children: ["Jenis Cuti ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "text-[#DC2626]",
              renderId: "render-b5517686",
              as: "span",
              children: "*"
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            required: true,
            value: form.jenis_cuti,
            onChange: (e) => setForm((f) => ({
              ...f,
              jenis_cuti: e.target.value
            })),
            className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
            renderId: "render-5c3445d7",
            as: "select",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              value: "",
              renderId: "render-3db38517",
              as: "option",
              children: "Pilih jenis cuti..."
            }), JENIS_CUTI.map((j) => /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              value: j.value,
              renderId: "render-6068cfa6",
              as: "option",
              children: j.label
            }, j.value))]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "grid grid-cols-2 gap-4",
          renderId: "render-c94e4ea1",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            renderId: "render-ac89c9ab",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "block text-sm font-medium text-[#374151] mb-1.5",
              renderId: "render-3c9fb494",
              as: "label",
              children: ["Tanggal Mulai ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-[#DC2626]",
                renderId: "render-2d2d5fde",
                as: "span",
                children: "*"
              })]
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              type: "date",
              required: true,
              value: form.tanggal_mulai,
              onChange: (e) => setForm((f) => ({
                ...f,
                tanggal_mulai: e.target.value
              })),
              className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
              renderId: "render-2c55dea9",
              as: "input"
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            renderId: "render-84000755",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "block text-sm font-medium text-[#374151] mb-1.5",
              renderId: "render-c771c42a",
              as: "label",
              children: ["Tanggal Selesai ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-[#DC2626]",
                renderId: "render-4ac077fd",
                as: "span",
                children: "*"
              })]
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              type: "date",
              required: true,
              value: form.tanggal_selesai,
              min: form.tanggal_mulai,
              onChange: (e) => setForm((f) => ({
                ...f,
                tanggal_selesai: e.target.value
              })),
              className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
              renderId: "render-df35266c",
              as: "input"
            })]
          })]
        }), jumlahHari > 0 && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex items-center gap-2 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]",
          renderId: "render-46840e61",
          as: "div",
          children: [/* @__PURE__ */ jsx(Calendar, {
            size: 16,
            className: "text-[#6B7280]"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "text-sm text-[#374151]",
            renderId: "render-0e537318",
            as: "span",
            children: ["Total: ", /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "text-[#2563EB]",
              renderId: "render-daf92146",
              as: "strong",
              children: [jumlahHari, " hari kerja"]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-7fd73fac",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#374151] mb-1.5",
            renderId: "render-76f0ab6b",
            as: "label",
            children: ["Alasan Pengajuan ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "text-[#DC2626]",
              renderId: "render-3592bda1",
              as: "span",
              children: "*"
            })]
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            required: true,
            rows: 3,
            placeholder: "Jelaskan alasan pengajuan cuti...",
            value: form.alasan,
            onChange: (e) => setForm((f) => ({
              ...f,
              alasan: e.target.value
            })),
            className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] resize-none",
            renderId: "render-485d5327",
            as: "textarea"
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "grid grid-cols-2 gap-4",
          renderId: "render-02fe2a82",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            renderId: "render-e13b1682",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "block text-sm font-medium text-[#374151] mb-1.5",
              renderId: "render-882f87c6",
              as: "label",
              children: "Alamat Selama Cuti"
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              type: "text",
              placeholder: "Alamat...",
              value: form.alamat_selama_cuti,
              onChange: (e) => setForm((f) => ({
                ...f,
                alamat_selama_cuti: e.target.value
              })),
              className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
              renderId: "render-0eda9072",
              as: "input"
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            renderId: "render-8fc65a78",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "block text-sm font-medium text-[#374151] mb-1.5",
              renderId: "render-cdf23e5e",
              as: "label",
              children: "No. Telp Selama Cuti"
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              type: "tel",
              placeholder: "08xxxxxxxxxx",
              value: form.telepon_selama_cuti,
              onChange: (e) => setForm((f) => ({
                ...f,
                telepon_selama_cuti: e.target.value
              })),
              className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
              renderId: "render-5540b790",
              as: "input"
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex justify-end gap-3 pt-2",
          renderId: "render-7b3d2982",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: "/cuti",
            className: "px-4 py-2 border border-[#E5E7EB] text-sm text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors",
            renderId: "render-8fdbd184",
            as: "a",
            children: "Batal"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            type: "submit",
            disabled: submitting,
            className: "inline-flex items-center gap-2 px-6 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors",
            renderId: "render-b380eaa8",
            as: "button",
            children: submitting ? /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(Loader2, {
                size: 16,
                className: "animate-spin"
              }), " Mengajukan..."]
            }) : "Ajukan Cuti"
          })]
        })]
      })]
    })
  });
}

const page$d = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(CutiAjukanPage, {
      ...props
    })
  });
});

const route6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$d
}, Symbol.toStringTag, { value: 'Module' }));

function DossierLayout() {
  const navItems = [{
    name: "Dashboard Dossier",
    href: "/dossier",
    icon: FolderOpen,
    end: true
  }, {
    name: "Upload Dokumen",
    href: "/dossier/upload",
    icon: UploadCloud,
    end: false
  }];
  return /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
    className: "min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col md:flex-row",
    renderId: "render-8f03442f",
    as: "div",
    children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "w-full md:w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/60 p-6 flex flex-col gap-8 shadow-2xl relative z-10",
      renderId: "render-387d74e8",
      as: "aside",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "flex items-center gap-3",
        renderId: "render-c71007c4",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30",
          renderId: "render-c644b2b1",
          as: "div",
          children: /* @__PURE__ */ jsx(FileText, {
            size: 24
          })
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-daf25016",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent",
            renderId: "render-96325c96",
            as: "h1",
            children: "Digital Dossier"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-xs text-slate-400",
            renderId: "render-7e2e51ee",
            as: "p",
            children: "SI KEPEGAWAIAN"
          })]
        })]
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "flex flex-col gap-2",
        renderId: "render-939cc853",
        as: "nav",
        children: navItems.map((item) => /* @__PURE__ */ jsxs(NavLink, {
          to: item.href,
          end: item.end,
          className: ({
            isActive
          }) => clsx("flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group", isActive ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"),
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-3",
            renderId: "render-7b171f72",
            as: "div",
            children: [/* @__PURE__ */ jsx(item.icon, {
              size: 18,
              className: "transition-transform group-hover:scale-110"
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "font-medium text-sm",
              renderId: "render-f665ec04",
              as: "span",
              children: item.name
            })]
          }), /* @__PURE__ */ jsx(ChevronRight, {
            size: 14,
            className: "opacity-0 group-hover:opacity-100 transition-opacity"
          })]
        }, item.name))
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "mt-auto relative rounded-2xl p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 overflow-hidden",
        renderId: "render-713c578a",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16",
          renderId: "render-84f63de3",
          as: "div"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-xs text-slate-400 relative z-10 leading-relaxed",
          renderId: "render-3a758297",
          as: "p",
          children: "Pastikan semua dokumen diunggah dalam format PDF atau gambar dengan resolusi yang jelas."
        })]
      })]
    }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "flex-1 flex flex-col relative overflow-hidden",
      renderId: "render-53034410",
      as: "main",
      children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none",
        renderId: "render-7116d2cc",
        as: "div"
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-cyan-900/10 blur-[100px] pointer-events-none",
        renderId: "render-6a6b6c98",
        as: "div"
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "flex-1 overflow-y-auto p-6 md:p-10 relative z-10 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent",
        renderId: "render-9ac80753",
        as: "div",
        children: /* @__PURE__ */ jsx(Outlet$1, {})
      })]
    })]
  });
}

function useUpload() {
  const [loading, setLoading] = React.useState(false);
  const upload = React.useCallback(async input => {
    try {
      setLoading(true);
      let response;
      if ("file" in input && input.file) {
        const formData = new FormData();
        formData.append("file", input.file);
        response = await fetch("/_create/api/upload/", {
          method: "POST",
          body: formData
        });
      } else if ("url" in input) {
        response = await fetch("/_create/api/upload/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url: input.url
          })
        });
      } else if ("base64" in input) {
        response = await fetch("/_create/api/upload/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            base64: input.base64
          })
        });
      } else {
        response = await fetch("/_create/api/upload/", {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream"
          },
          body: input.buffer
        });
      }
      if (!response.ok) {
        if (response.status === 413) {
          throw new Error("Upload failed: File too large.");
        }
        throw new Error("Upload failed");
      }
      const data = await response.json();
      return {
        url: data.url,
        mimeType: data.mimeType || null
      };
    } catch (uploadError) {
      if (uploadError instanceof Error) {
        return {
          error: uploadError.message
        };
      }
      if (typeof uploadError === "string") {
        return {
          error: uploadError
        };
      }
      return {
        error: "Upload failed"
      };
    } finally {
      setLoading(false);
    }
  }, []);
  return [upload, {
    loading
  }];
}

const KATEGORI_LIST = ["Identitas", "Kepegawaian", "Pendidikan", "Kompetensi"];
const STATUS_CONFIG$2 = {
  verified: {
    label: "Terverifikasi",
    className: "bg-[#ECFDF5] text-[#059669]",
    icon: CheckCircle2
  },
  pending: {
    label: "Menunggu Verifikasi",
    className: "bg-[#FEF3C7] text-[#B45309]",
    icon: Clock
  },
  rejected: {
    label: "Ditolak",
    className: "bg-[#FEF2F2] text-[#DC2626]",
    icon: AlertCircle
  }
};
function DossierPage() {
  const {
    data: user,
    loading: userLoading
  } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
      return;
    }
    if (user) fetchProfile();
  }, [user, userLoading]);
  useEffect(() => {
    if (pegawai) fetchDokumen();
  }, [pegawai, filterKategori]);
  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) {
      window.location.href = "/onboarding";
      return;
    }
    if (res.ok) {
      const d = await res.json();
      setPegawai(d.pegawai);
    }
  };
  const fetchDokumen = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterKategori) params.append("kategori", filterKategori);
      const res = await fetch(`/api/dossier/list?${params}`);
      if (res.ok) {
        const d = await res.json();
        setDokumen(d.dokumen || []);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Hapus dokumen ini?")) return;
    await fetch(`/api/dossier/${id}`, {
      method: "DELETE"
    });
    fetchDokumen();
  };
  const filtered = dokumen.filter((d) => d.jenis_dokumen?.toLowerCase().includes(search.toLowerCase()) || d.deskripsi?.toLowerCase().includes(search.toLowerCase()));
  const stats = {
    total: dokumen.length,
    verified: dokumen.filter((d) => d.status === "verified").length,
    pending: dokumen.filter((d) => d.status === "pending").length,
    rejected: dokumen.filter((d) => d.status === "rejected").length
  };
  if (userLoading || !pegawai) return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
    className: "flex min-h-screen items-center justify-center bg-[#F9FAFB]",
    renderId: "render-0bba4564",
    as: "div",
    children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "text-sm text-[#6B7280]",
      renderId: "render-f584d41b",
      as: "div",
      children: "Memuat..."
    })
  });
  return /* @__PURE__ */ jsxs(AppLayout, {
    pegawai,
    activeHref: "/dossier",
    children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "flex items-center justify-between mb-6",
      renderId: "render-57fece31",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        renderId: "render-f157f1ea",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-2xl font-semibold text-[#111827] tracking-tight mb-1",
          renderId: "render-a44e1e26",
          as: "h2",
          children: "Digital Dossier"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#6B7280]",
          renderId: "render-2bbd77a4",
          as: "p",
          children: "Arsip digital dokumen kepegawaian"
        })]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        href: "/dossier/upload",
        className: "inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors",
        renderId: "render-8997a6a1",
        as: "a",
        children: [/* @__PURE__ */ jsx(Upload, {
          size: 16
        }), " Upload Dokumen"]
      })]
    }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6",
      renderId: "render-c04104cb",
      as: "div",
      children: [{
        label: "Total Dokumen",
        value: stats.total,
        className: "bg-[#EFF6FF] text-[#2563EB]"
      }, {
        label: "Terverifikasi",
        value: stats.verified,
        className: "bg-[#ECFDF5] text-[#059669]"
      }, {
        label: "Menunggu",
        value: stats.pending,
        className: "bg-[#FEF3C7] text-[#B45309]"
      }, {
        label: "Ditolak",
        value: stats.rejected,
        className: "bg-[#FEF2F2] text-[#DC2626]"
      }].map((s) => /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "bg-white rounded-xl border border-[#E5E7EB] p-4",
        renderId: "render-e476b5a7",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-xs text-[#6B7280] mb-1",
          renderId: "render-ad78531a",
          as: "p",
          children: s.label
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: `text-2xl font-bold ${s.className.split(" ")[1]}`,
          renderId: "render-b319a50e",
          as: "p",
          children: s.value
        })]
      }, s.label))
    }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "bg-white rounded-xl border border-[#E5E7EB] p-4 mb-6 flex flex-wrap gap-4 items-center",
      renderId: "render-278c756f",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "relative flex-1 min-w-[200px]",
        renderId: "render-f0acd7cf",
        as: "div",
        children: [/* @__PURE__ */ jsx(Search, {
          size: 16,
          className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          type: "text",
          placeholder: "Cari dokumen...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "w-full pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
          renderId: "render-48c533ba",
          as: "input"
        })]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        value: filterKategori,
        onChange: (e) => setFilterKategori(e.target.value),
        className: "px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
        renderId: "render-e24a725f",
        as: "select",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          value: "",
          renderId: "render-c7c0735d",
          as: "option",
          children: "Semua Kategori"
        }), KATEGORI_LIST.map((k) => /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          value: k,
          renderId: "render-41037138",
          as: "option",
          children: k
        }, k))]
      })]
    }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "bg-white rounded-xl border border-[#E5E7EB] overflow-hidden",
      renderId: "render-6820655e",
      as: "div",
      children: loading ? /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "px-4 py-12 text-center text-sm text-[#6B7280]",
        renderId: "render-38189b30",
        as: "div",
        children: "Memuat dokumen..."
      }) : filtered.length === 0 ? /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "px-4 py-16 text-center",
        renderId: "render-0d832369",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4",
          renderId: "render-7e28d11e",
          as: "div",
          children: /* @__PURE__ */ jsx(FolderOpen, {
            size: 32,
            className: "text-[#9CA3AF]"
          })
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm font-medium text-[#111827] mb-1",
          renderId: "render-881da6dc",
          as: "p",
          children: search || filterKategori ? "Dokumen tidak ditemukan" : "Belum ada dokumen"
        }), !search && !filterKategori && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          href: "/dossier/upload",
          className: "inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#2563EB] text-white text-sm rounded-lg hover:bg-[#1D4ED8]",
          renderId: "render-68d04b72",
          as: "a",
          children: [/* @__PURE__ */ jsx(Upload, {
            size: 16
          }), " Upload Dokumen Pertama"]
        })]
      }) : /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "overflow-x-auto",
        renderId: "render-acd94f73",
        as: "div",
        children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "w-full",
          renderId: "render-214e8e11",
          as: "table",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            renderId: "render-56bee26c",
            as: "thead",
            children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "bg-[#F9FAFB] border-b border-[#E5E7EB]",
              renderId: "render-6dd97510",
              as: "tr",
              children: [pegawai.role === "admin" && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase",
                renderId: "render-384cec03",
                as: "th",
                children: "Pegawai"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase",
                renderId: "render-b2bd5322",
                as: "th",
                children: "Dokumen"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase",
                renderId: "render-741ab911",
                as: "th",
                children: "Kategori"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase",
                renderId: "render-e3761962",
                as: "th",
                children: "Tgl Upload"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase",
                renderId: "render-b9bab510",
                as: "th",
                children: "Status"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase",
                renderId: "render-587beb49",
                as: "th",
                children: "Aksi"
              })]
            })
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "divide-y divide-[#E5E7EB]",
            renderId: "render-ff077f24",
            as: "tbody",
            children: filtered.map((doc) => {
              const conf = STATUS_CONFIG$2[doc.status] || STATUS_CONFIG$2.pending;
              const Icon = conf.icon;
              return /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "hover:bg-[#F9FAFB] transition-colors group",
                renderId: "render-3af0e8c7",
                as: "tr",
                children: [pegawai.role === "admin" && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#111827]",
                  renderId: "render-cc27c5fd",
                  as: "td",
                  children: [doc.nama_lengkap, /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    renderId: "render-7cdbf551",
                    as: "br"
                  }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    className: "text-xs text-[#6B7280] font-mono",
                    renderId: "render-07cfaf18",
                    as: "span",
                    children: doc.nip
                  })]
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3",
                  renderId: "render-11a42fe3",
                  as: "td",
                  children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                    className: "flex items-center gap-2.5",
                    renderId: "render-95fa70f0",
                    as: "div",
                    children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                      className: "w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center flex-shrink-0",
                      renderId: "render-74ef35be",
                      as: "div",
                      children: /* @__PURE__ */ jsx(FileText, {
                        size: 16,
                        className: "text-[#2563EB]"
                      })
                    }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                      renderId: "render-027f86a7",
                      as: "div",
                      children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                        className: "text-sm font-medium text-[#111827]",
                        renderId: "render-b98c2423",
                        as: "p",
                        children: doc.jenis_dokumen
                      }), doc.deskripsi && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                        className: "text-xs text-[#6B7280] line-clamp-1",
                        renderId: "render-4f5192fb",
                        as: "p",
                        children: doc.deskripsi
                      })]
                    })]
                  })
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3",
                  renderId: "render-e1c68d9d",
                  as: "td",
                  children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    className: "px-2.5 py-1 bg-[#F3F4F6] text-[#374151] text-xs rounded-full",
                    renderId: "render-93973fb0",
                    as: "span",
                    children: doc.kategori
                  })
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#6B7280]",
                  renderId: "render-7d3edc0c",
                  as: "td",
                  children: new Date(doc.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })
                }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                  className: "px-4 py-3",
                  renderId: "render-5e8278ad",
                  as: "td",
                  children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                    className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${conf.className}`,
                    renderId: "render-d17574be",
                    as: "span",
                    children: [/* @__PURE__ */ jsx(Icon, {
                      size: 12
                    }), conf.label]
                  }), doc.status === "rejected" && doc.catatan && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    className: "text-[10px] text-[#DC2626] mt-1 max-w-[120px] line-clamp-1",
                    renderId: "render-23e9c6ca",
                    as: "p",
                    children: doc.catatan
                  })]
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3",
                  renderId: "render-a4d4c494",
                  as: "td",
                  children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                    className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                    renderId: "render-76b504c9",
                    as: "div",
                    children: [doc.file_url && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                      href: doc.file_url,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "p-1.5 hover:bg-[#EFF6FF] rounded transition-colors",
                      title: "Lihat",
                      renderId: "render-553e3893",
                      as: "a",
                      children: /* @__PURE__ */ jsx(Eye, {
                        size: 16,
                        className: "text-[#6B7280]"
                      })
                    }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                      onClick: () => handleDelete(doc.id),
                      className: "p-1.5 hover:bg-[#FEF2F2] rounded transition-colors",
                      title: "Hapus",
                      renderId: "render-52d3b322",
                      as: "button",
                      children: /* @__PURE__ */ jsx(Trash2, {
                        size: 16,
                        className: "text-[#6B7280] hover:text-[#DC2626]"
                      })
                    })]
                  })
                })]
              }, doc.id);
            })
          })]
        })
      })
    })]
  });
}

const page$c = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(DossierLayout, {
      children: /* @__PURE__ */jsx(DossierPage, {
        ...props
      })
    })
  });
});

const route7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$c
}, Symbol.toStringTag, { value: 'Module' }));

const DOC_CATEGORIES = [{
  name: "Identitas",
  types: ["KTP", "Kartu Keluarga", "NPWP", "Akta Kelahiran", "Pas Foto"]
}, {
  name: "Kepegawaian",
  types: ["SK CPNS", "SK PNS", "SK Pangkat Terakhir", "SK Jabatan", "Karis/Karsu", "SK Mutasi"]
}, {
  name: "Pendidikan",
  types: ["Ijazah Terakhir", "Transkrip Nilai", "Ijazah SD", "Ijazah SMP", "Ijazah SMA"]
}, {
  name: "Kompetensi",
  types: ["Sertifikat Diklat PIM", "Sertifikat Teknis", "Sertifikat Seminar", "Sertifikat Bahasa"]
}];
function DossierUploadPage() {
  const {
    data: user,
    loading: userLoading
  } = useUser();
  const [upload, {
    loading: uploadLoading
  }] = useUpload();
  const [pegawai, setPegawai] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [form, setForm] = useState({
    kategori: "",
    jenis_dokumen: "",
    deskripsi: "",
    masa_berlaku: ""
  });
  const availableTypes = form.kategori ? DOC_CATEGORIES.find((c) => c.name === form.kategori)?.types || [] : [];
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
      return;
    }
    if (user) fetchProfile();
  }, [user, userLoading]);
  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) {
      window.location.href = "/onboarding";
      return;
    }
    if (res.ok) {
      const d = await res.json();
      setPegawai(d.pegawai);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Pilih file dokumen terlebih dahulu");
      return;
    }
    if (!form.kategori || !form.jenis_dokumen) {
      setError("Kategori dan jenis dokumen wajib diisi");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const uploadResult = await upload({
        file
      });
      if (uploadResult.error) throw new Error("Gagal mengupload file: " + uploadResult.error);
      const res = await fetch("/api/dossier/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          file_url: uploadResult.url
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan dokumen");
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/dossier";
      }, 2e3);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };
  if (userLoading || !pegawai) return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
    className: "flex min-h-screen items-center justify-center bg-[#F9FAFB]",
    renderId: "render-f2e92337",
    as: "div",
    children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "text-sm text-[#6B7280]",
      renderId: "render-bf37e123",
      as: "div",
      children: "Memuat..."
    })
  });
  return /* @__PURE__ */ jsx(AppLayout, {
    pegawai,
    activeHref: "/dossier",
    children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "max-w-2xl mx-auto",
      renderId: "render-3aad864f",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "flex items-center gap-3 mb-6",
        renderId: "render-9f09ea27",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          href: "/dossier",
          className: "p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors",
          renderId: "render-77b8357d",
          as: "a",
          children: /* @__PURE__ */ jsx(ArrowLeft, {
            size: 20,
            className: "text-[#6B7280]"
          })
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-9dae0b49",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-2xl font-semibold text-[#111827] tracking-tight",
            renderId: "render-6f81d136",
            as: "h2",
            children: "Upload Dokumen"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-sm text-[#6B7280]",
            renderId: "render-c44e523b",
            as: "p",
            children: "Unggah dokumen kepegawaian ke arsip digital"
          })]
        })]
      }), success && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "mb-6 p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-3",
        renderId: "render-533526a0",
        as: "div",
        children: [/* @__PURE__ */ jsx(Check, {
          size: 20,
          className: "text-[#059669]"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#059669] font-medium",
          renderId: "render-db959bbf",
          as: "p",
          children: "Dokumen berhasil diupload! Menunggu verifikasi admin."
        })]
      }), error && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "mb-6 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-center gap-3",
        renderId: "render-b08dfd8d",
        as: "div",
        children: [/* @__PURE__ */ jsx(X, {
          size: 20,
          className: "text-[#DC2626]"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#DC2626]",
          renderId: "render-012bc314",
          as: "p",
          children: error
        })]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        onSubmit: handleSubmit,
        className: "bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5",
        renderId: "render-599b7cae",
        as: "form",
        children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "grid grid-cols-2 gap-4",
          renderId: "render-28278224",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            renderId: "render-33086974",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "block text-sm font-medium text-[#374151] mb-1.5",
              renderId: "render-3de693f3",
              as: "label",
              children: ["Kategori ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-[#DC2626]",
                renderId: "render-f212e9fc",
                as: "span",
                children: "*"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              required: true,
              value: form.kategori,
              onChange: (e) => setForm((f) => ({
                ...f,
                kategori: e.target.value,
                jenis_dokumen: ""
              })),
              className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
              renderId: "render-896c362c",
              as: "select",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                value: "",
                renderId: "render-a1c756e8",
                as: "option",
                children: "Pilih kategori..."
              }), DOC_CATEGORIES.map((c) => /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                value: c.name,
                renderId: "render-65b7cad8",
                as: "option",
                children: c.name
              }, c.name))]
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            renderId: "render-ac024397",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "block text-sm font-medium text-[#374151] mb-1.5",
              renderId: "render-c78f9ae2",
              as: "label",
              children: ["Jenis Dokumen ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-[#DC2626]",
                renderId: "render-5d9c5830",
                as: "span",
                children: "*"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              required: true,
              disabled: !form.kategori,
              value: form.jenis_dokumen,
              onChange: (e) => setForm((f) => ({
                ...f,
                jenis_dokumen: e.target.value
              })),
              className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] disabled:opacity-50",
              renderId: "render-cc9fdaff",
              as: "select",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                value: "",
                renderId: "render-d8133d92",
                as: "option",
                children: "Pilih jenis..."
              }), availableTypes.map((t) => /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                value: t,
                renderId: "render-4ce015fb",
                as: "option",
                children: t
              }, t))]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-50767453",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#374151] mb-1.5",
            renderId: "render-cf00af56",
            as: "label",
            children: "Keterangan / Nomor Dokumen"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            type: "text",
            placeholder: "Contoh: SK No. 123/BKD/2023",
            value: form.deskripsi,
            onChange: (e) => setForm((f) => ({
              ...f,
              deskripsi: e.target.value
            })),
            className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
            renderId: "render-8e2adef3",
            as: "input"
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-4e8e41c0",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#374151] mb-1.5",
            renderId: "render-4bdcb71d",
            as: "label",
            children: "Masa Berlaku (opsional)"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            type: "date",
            value: form.masa_berlaku,
            onChange: (e) => setForm((f) => ({
              ...f,
              masa_berlaku: e.target.value
            })),
            className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
            renderId: "render-a4d89054",
            as: "input"
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-d707131b",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#374151] mb-1.5",
            renderId: "render-fbbd651e",
            as: "label",
            children: ["File Dokumen ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "text-[#DC2626]",
              renderId: "render-1754f965",
              as: "span",
              children: "*"
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: `border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragActive ? "border-[#2563EB] bg-[#EFF6FF]" : file ? "border-[#059669] bg-[#ECFDF5]" : "border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#F9FAFB]"}`,
            onDragEnter: () => setDragActive(true),
            onDragLeave: () => setDragActive(false),
            onDragOver: (e) => e.preventDefault(),
            onDrop: handleDrop,
            onClick: () => document.getElementById("dossier-file").click(),
            renderId: "render-b83585ce",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              id: "dossier-file",
              type: "file",
              className: "hidden",
              accept: ".pdf,.jpg,.jpeg,.png",
              onChange: (e) => {
                if (e.target.files?.[0]) setFile(e.target.files[0]);
              },
              renderId: "render-534fe9f0",
              as: "input"
            }), file ? /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "flex flex-col items-center gap-2",
              renderId: "render-bbc950f4",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "w-10 h-10 bg-[#ECFDF5] rounded-full flex items-center justify-center",
                renderId: "render-394569a8",
                as: "div",
                children: /* @__PURE__ */ jsx(Check, {
                  size: 20,
                  className: "text-[#059669]"
                })
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm font-medium text-[#059669]",
                renderId: "render-226cef6e",
                as: "p",
                children: file.name
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-7a039b6a",
                as: "p",
                children: [(file.size / 1024 / 1024).toFixed(2), " MB"]
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                type: "button",
                onClick: (e) => {
                  e.stopPropagation();
                  setFile(null);
                },
                className: "text-xs text-[#DC2626] hover:underline flex items-center gap-1",
                renderId: "render-40b83214",
                as: "button",
                children: [/* @__PURE__ */ jsx(X, {
                  size: 12
                }), " Hapus file"]
              })]
            }) : /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "flex flex-col items-center gap-2",
              renderId: "render-ad5bf62e",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center",
                renderId: "render-aaede4b0",
                as: "div",
                children: /* @__PURE__ */ jsx(Upload, {
                  size: 20,
                  className: "text-[#9CA3AF]"
                })
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "text-sm text-[#6B7280]",
                renderId: "render-5de58a54",
                as: "p",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-[#2563EB] font-medium",
                  renderId: "render-47aceffb",
                  as: "span",
                  children: "Klik untuk upload"
                }), " atau seret file ke sini"]
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#9CA3AF]",
                renderId: "render-a10711cd",
                as: "p",
                children: "PDF, JPG, PNG — Maks. 5MB"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex justify-end gap-3 pt-2",
          renderId: "render-951422e7",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: "/dossier",
            className: "px-4 py-2 border border-[#E5E7EB] text-sm text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors",
            renderId: "render-d955c763",
            as: "a",
            children: "Batal"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            type: "submit",
            disabled: submitting || uploadLoading,
            className: "inline-flex items-center gap-2 px-6 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors",
            renderId: "render-3287a733",
            as: "button",
            children: submitting || uploadLoading ? /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(Loader2, {
                size: 16,
                className: "animate-spin"
              }), " Mengupload..."]
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(Upload, {
                size: 16
              }), " Upload Dokumen"]
            })
          })]
        })]
      })]
    })
  });
}

const page$b = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(DossierLayout, {
      children: /* @__PURE__ */jsx(DossierUploadPage, {
        ...props
      })
    })
  });
});

const route8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$b
}, Symbol.toStringTag, { value: 'Module' }));

const STATUS_FLOW = [{
  key: "usulan",
  label: "Usulan Diajukan",
  desc: "Berkas usulan diterima"
}, {
  key: "di_bkd",
  label: "Di BKD",
  desc: "Sedang diproses BKD"
}, {
  key: "di_bkn",
  label: "Di BKN",
  desc: "Sedang diproses BKN"
}, {
  key: "sk_terbit",
  label: "SK Terbit",
  desc: "SK kenaikan pangkat diterbitkan"
}, {
  key: "selesai",
  label: "Selesai",
  desc: "Proses selesai"
}];
const STATUS_IDX = {
  usulan: 0,
  di_bkd: 1,
  di_bkn: 2,
  sk_terbit: 3,
  selesai: 4
};
function KenaikanPangkatPage() {
  const {
    data: user,
    loading: userLoading
  } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [kpList, setKpList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
      return;
    }
    if (user) fetchProfile();
  }, [user, userLoading]);
  useEffect(() => {
    if (pegawai) fetchKP();
  }, [pegawai, filterStatus]);
  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) {
      window.location.href = "/onboarding";
      return;
    }
    if (res.ok) {
      const d = await res.json();
      setPegawai(d.pegawai);
    }
  };
  const fetchKP = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      const res = await fetch(`/api/kenaikan-pangkat/list?${params}`);
      if (res.ok) {
        const d = await res.json();
        setKpList(d.kenaikan_pangkat || []);
      }
    } finally {
      setLoading(false);
    }
  };
  if (userLoading || !pegawai) return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
    className: "flex min-h-screen items-center justify-center bg-[#F9FAFB]",
    renderId: "render-c65da0bd",
    as: "div",
    children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "text-sm text-[#6B7280]",
      renderId: "render-e1394819",
      as: "div",
      children: "Memuat..."
    })
  });
  return /* @__PURE__ */ jsxs(AppLayout, {
    pegawai,
    activeHref: "/kenaikan-pangkat",
    children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "flex items-center justify-between mb-6",
      renderId: "render-f7a7cf5f",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        renderId: "render-83d537d4",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-2xl font-semibold text-[#111827] tracking-tight mb-1",
          renderId: "render-13de5152",
          as: "h2",
          children: "Kenaikan Pangkat"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#6B7280]",
          renderId: "render-2406220c",
          as: "p",
          children: "Tracking usulan kenaikan pangkat dan nominatif"
        })]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        href: "/kenaikan-pangkat/usulan",
        className: "inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors",
        renderId: "render-7e6f122a",
        as: "a",
        children: [/* @__PURE__ */ jsx(Plus, {
          size: 16
        }), " Buat Usulan"]
      })]
    }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "bg-white rounded-xl border border-[#E5E7EB] p-4 mb-6 flex items-center gap-4",
      renderId: "render-8a045ae7",
      as: "div",
      children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "text-sm text-[#6B7280]",
        renderId: "render-f9afd0a2",
        as: "label",
        children: "Status:"
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        value: filterStatus,
        onChange: (e) => setFilterStatus(e.target.value),
        className: "px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
        renderId: "render-846cf02b",
        as: "select",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          value: "",
          renderId: "render-f66ef86d",
          as: "option",
          children: "Semua"
        }), STATUS_FLOW.map((s) => /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          value: s.key,
          renderId: "render-8d375d14",
          as: "option",
          children: s.label
        }, s.key))]
      })]
    }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "space-y-4",
      renderId: "render-6583bbbb",
      as: "div",
      children: loading ? /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "bg-white rounded-xl border border-[#E5E7EB] px-4 py-12 text-center text-sm text-[#6B7280]",
        renderId: "render-0b045ab1",
        as: "div",
        children: "Memuat data..."
      }) : kpList.length === 0 ? /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "bg-white rounded-xl border border-[#E5E7EB] px-4 py-16 text-center",
        renderId: "render-b2a0b152",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4",
          renderId: "render-f9b94573",
          as: "div",
          children: /* @__PURE__ */ jsx(Award, {
            size: 32,
            className: "text-[#9CA3AF]"
          })
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm font-medium text-[#111827] mb-1",
          renderId: "render-775ae835",
          as: "p",
          children: "Belum ada usulan kenaikan pangkat"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-xs text-[#6B7280] mb-4",
          renderId: "render-d61340f2",
          as: "p",
          children: "Buat usulan baru untuk memulai proses kenaikan pangkat"
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          href: "/kenaikan-pangkat/usulan",
          className: "inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm rounded-lg hover:bg-[#1D4ED8]",
          renderId: "render-334af2a5",
          as: "a",
          children: [/* @__PURE__ */ jsx(Plus, {
            size: 16
          }), " Buat Usulan Baru"]
        })]
      }) : kpList.map((kp) => {
        const currentStep = STATUS_IDX[kp.status] ?? 0;
        return /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "bg-white rounded-xl border border-[#E5E7EB] p-5",
          renderId: "render-4a674a0f",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-start justify-between mb-4",
            renderId: "render-2c0aee96",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-67fa3bc2",
              as: "div",
              children: [pegawai.role !== "pegawai" && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "mb-1",
                renderId: "render-77b7ba7c",
                as: "div",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-sm font-semibold text-[#111827]",
                  renderId: "render-8f7142e8",
                  as: "span",
                  children: kp.nama_lengkap
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-xs text-[#6B7280] font-mono ml-2",
                  renderId: "render-c0dcc53b",
                  as: "span",
                  children: kp.nip
                })]
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-base font-semibold text-[#111827]",
                renderId: "render-b6ce44e4",
                as: "p",
                children: kp.jenis_kenaikan
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "text-sm text-[#6B7280]",
                renderId: "render-fd62f429",
                as: "p",
                children: [kp.pangkat_lama, " (", kp.golongan_lama, ") ", /* @__PURE__ */ jsx(ArrowRight, {
                  size: 14,
                  className: "inline"
                }), " ", kp.pangkat_baru || "?", " (", kp.golongan_baru || "?", ")"]
              })]
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "text-xs text-[#6B7280]",
              renderId: "render-126896a3",
              as: "p",
              children: kp.created_at ? new Date(kp.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric"
              }) : ""
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "relative",
            renderId: "render-d31587a9",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "flex items-center justify-between mb-2",
              renderId: "render-9537875a",
              as: "div",
              children: STATUS_FLOW.map((s, idx) => /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "flex flex-col items-center gap-1 flex-1",
                renderId: "render-095dc2a5",
                as: "div",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${idx < currentStep ? "bg-[#2563EB] border-[#2563EB] text-white" : idx === currentStep ? "bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]" : "bg-white border-[#E5E7EB] text-[#9CA3AF]"}`,
                  renderId: "render-f7e1190b",
                  as: "div",
                  children: idx < currentStep ? /* @__PURE__ */ jsx(CheckCircle2, {
                    size: 14
                  }) : idx + 1
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-[10px] text-center text-[#6B7280] hidden md:block leading-tight max-w-[60px]",
                  renderId: "render-c9ded8dd",
                  as: "p",
                  children: s.label
                })]
              }, s.key))
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "absolute top-3.5 left-3.5 right-3.5 h-0.5 bg-[#E5E7EB] -z-10",
              renderId: "render-4f0ba8ff",
              as: "div",
              children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "h-full bg-[#2563EB] transition-all",
                style: {
                  width: `${currentStep / (STATUS_FLOW.length - 1) * 100}%`
                },
                renderId: "render-f8d98505",
                as: "div"
              })
            })]
          }), kp.catatan && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-xs text-[#6B7280] mt-3 p-2 bg-[#F9FAFB] rounded-lg",
            renderId: "render-5eb01f0c",
            as: "p",
            children: kp.catatan
          })]
        }, kp.id);
      })
    })]
  });
}

const page$a = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(KenaikanPangkatPage, {
      ...props
    })
  });
});

const route9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$a
}, Symbol.toStringTag, { value: 'Module' }));

const JENIS_KP = ["Kenaikan Pangkat Reguler", "Kenaikan Pangkat Pilihan", "Kenaikan Pangkat Pengabdian", "Kenaikan Pangkat Anumerta"];
const GOLONGAN_LIST = ["I/a", "I/b", "I/c", "I/d", "II/a", "II/b", "II/c", "II/d", "III/a", "III/b", "III/c", "III/d", "IV/a", "IV/b", "IV/c", "IV/d", "IV/e"];
function KPUsulanPage() {
  const {
    data: user,
    loading: userLoading
  } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    jenis_kenaikan: "",
    golongan_baru: "",
    pangkat_baru: "",
    tmt_usulan: "",
    periode_usulan: "",
    catatan: ""
  });
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
      return;
    }
    if (user) fetchProfile();
  }, [user, userLoading]);
  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) {
      window.location.href = "/onboarding";
      return;
    }
    if (res.ok) {
      const d = await res.json();
      setPegawai(d.pegawai);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.jenis_kenaikan || !form.tmt_usulan) {
      setError("Jenis kenaikan dan TMT wajib diisi");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/kenaikan-pangkat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengajukan usulan");
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/kenaikan-pangkat";
      }, 2e3);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  if (userLoading || !pegawai) return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
    className: "flex min-h-screen items-center justify-center bg-[#F9FAFB]",
    renderId: "render-6e61069a",
    as: "div",
    children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "text-sm text-[#6B7280]",
      renderId: "render-0582bf36",
      as: "div",
      children: "Memuat..."
    })
  });
  return /* @__PURE__ */ jsx(AppLayout, {
    pegawai,
    activeHref: "/kenaikan-pangkat",
    children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "max-w-2xl mx-auto",
      renderId: "render-dec0a235",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "flex items-center gap-3 mb-6",
        renderId: "render-1d8b3fcc",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          href: "/kenaikan-pangkat",
          className: "p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors",
          renderId: "render-2a23f6e3",
          as: "a",
          children: /* @__PURE__ */ jsx(ArrowLeft, {
            size: 20,
            className: "text-[#6B7280]"
          })
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-a531dd17",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-2xl font-semibold text-[#111827] tracking-tight",
            renderId: "render-929b61f6",
            as: "h2",
            children: "Form Usulan Kenaikan Pangkat"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-sm text-[#6B7280]",
            renderId: "render-fbeb87b1",
            as: "p",
            children: "Isi formulir pengajuan kenaikan pangkat"
          })]
        })]
      }), success && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "mb-6 p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-3",
        renderId: "render-6d37cd51",
        as: "div",
        children: [/* @__PURE__ */ jsx(Check, {
          size: 20,
          className: "text-[#059669]"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#059669] font-medium",
          renderId: "render-9efa9c98",
          as: "p",
          children: "Usulan berhasil diajukan!"
        })]
      }), error && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "mb-6 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-center gap-3",
        renderId: "render-4dd2c3bd",
        as: "div",
        children: [/* @__PURE__ */ jsx(X, {
          size: 20,
          className: "text-[#DC2626]"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#DC2626]",
          renderId: "render-409fa039",
          as: "p",
          children: error
        })]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        onSubmit: handleSubmit,
        className: "bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5",
        renderId: "render-b98bda5f",
        as: "form",
        children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex items-center gap-3 p-3 bg-[#EFF6FF] rounded-lg",
          renderId: "render-92f4f86b",
          as: "div",
          children: [/* @__PURE__ */ jsx(Info, {
            size: 16,
            className: "text-[#2563EB] flex-shrink-0"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "text-sm",
            renderId: "render-8ddc37a6",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "text-[#1D4ED8] font-medium",
              renderId: "render-db05799e",
              as: "span",
              children: pegawai.nama_lengkap
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "text-[#6B7280] mx-2",
              renderId: "render-80e773d1",
              as: "span",
              children: "·"
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "text-[#6B7280]",
              renderId: "render-04f8e169",
              as: "span",
              children: ["Pangkat saat ini: ", pegawai.pangkat, " (", pegawai.golongan, ")"]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-a5778a7a",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#374151] mb-1.5",
            renderId: "render-18dac5c9",
            as: "label",
            children: ["Jenis Kenaikan Pangkat ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "text-[#DC2626]",
              renderId: "render-3ac420ae",
              as: "span",
              children: "*"
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            required: true,
            value: form.jenis_kenaikan,
            onChange: (e) => setForm((f) => ({
              ...f,
              jenis_kenaikan: e.target.value
            })),
            className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
            renderId: "render-71171dae",
            as: "select",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              value: "",
              renderId: "render-7ea3cc56",
              as: "option",
              children: "Pilih jenis..."
            }), JENIS_KP.map((j) => /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              value: j,
              renderId: "render-5f1ed44d",
              as: "option",
              children: j
            }, j))]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "grid grid-cols-2 gap-4",
          renderId: "render-ce63522e",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            renderId: "render-fd046b7c",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "block text-sm font-medium text-[#374151] mb-1.5",
              renderId: "render-0ffd9924",
              as: "label",
              children: "Golongan Baru"
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              value: form.golongan_baru,
              onChange: (e) => setForm((f) => ({
                ...f,
                golongan_baru: e.target.value
              })),
              className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
              renderId: "render-c3bf81fb",
              as: "select",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                value: "",
                renderId: "render-e9f20963",
                as: "option",
                children: "Pilih golongan..."
              }), GOLONGAN_LIST.map((g) => /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                value: g,
                renderId: "render-d8ea0586",
                as: "option",
                children: g
              }, g))]
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            renderId: "render-6c0afc46",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "block text-sm font-medium text-[#374151] mb-1.5",
              renderId: "render-35206b5f",
              as: "label",
              children: "Pangkat Baru"
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              type: "text",
              placeholder: "Contoh: Penata",
              value: form.pangkat_baru,
              onChange: (e) => setForm((f) => ({
                ...f,
                pangkat_baru: e.target.value
              })),
              className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
              renderId: "render-06b58b51",
              as: "input"
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "grid grid-cols-2 gap-4",
          renderId: "render-c90e392b",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            renderId: "render-5a87d014",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "block text-sm font-medium text-[#374151] mb-1.5",
              renderId: "render-96983516",
              as: "label",
              children: ["TMT Usulan ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-[#DC2626]",
                renderId: "render-82d33d56",
                as: "span",
                children: "*"
              })]
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              type: "date",
              required: true,
              value: form.tmt_usulan,
              onChange: (e) => setForm((f) => ({
                ...f,
                tmt_usulan: e.target.value
              })),
              className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
              renderId: "render-74bf6997",
              as: "input"
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            renderId: "render-2446f51b",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "block text-sm font-medium text-[#374151] mb-1.5",
              renderId: "render-35172cb2",
              as: "label",
              children: "Periode Usulan"
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              value: form.periode_usulan,
              onChange: (e) => setForm((f) => ({
                ...f,
                periode_usulan: e.target.value
              })),
              className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
              renderId: "render-e514c6f2",
              as: "select",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                value: "",
                renderId: "render-c20b1c94",
                as: "option",
                children: "Pilih..."
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                value: "April",
                renderId: "render-1b41e9a7",
                as: "option",
                children: "April"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                value: "Oktober",
                renderId: "render-2373b161",
                as: "option",
                children: "Oktober"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-f8991bff",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#374151] mb-1.5",
            renderId: "render-862a0d19",
            as: "label",
            children: "Catatan"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            rows: 3,
            placeholder: "Catatan atau informasi tambahan...",
            value: form.catatan,
            onChange: (e) => setForm((f) => ({
              ...f,
              catatan: e.target.value
            })),
            className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] resize-none",
            renderId: "render-032189f5",
            as: "textarea"
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex justify-end gap-3 pt-2",
          renderId: "render-149726ce",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: "/kenaikan-pangkat",
            className: "px-4 py-2 border border-[#E5E7EB] text-sm text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors",
            renderId: "render-3a66dea3",
            as: "a",
            children: "Batal"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            type: "submit",
            disabled: submitting,
            className: "inline-flex items-center gap-2 px-6 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors",
            renderId: "render-c399d4d1",
            as: "button",
            children: submitting ? /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(Loader2, {
                size: 16,
                className: "animate-spin"
              }), " Mengajukan..."]
            }) : "Ajukan Usulan"
          })]
        })]
      })]
    })
  });
}

const page$9 = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(KPUsulanPage, {
      ...props
    })
  });
});

const route10 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$9
}, Symbol.toStringTag, { value: 'Module' }));

const STATUS_CONFIG$1 = {
  pending: {
    label: "Menunggu",
    className: "bg-[#FEF3C7] text-[#B45309]"
  },
  proses: {
    label: "Diproses",
    className: "bg-[#EFF6FF] text-[#2563EB]"
  },
  selesai: {
    label: "Selesai",
    className: "bg-[#ECFDF5] text-[#059669]"
  }
};
function formatRupiah(num) {
  if (!num) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(num);
}
function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - /* @__PURE__ */ new Date();
  return Math.ceil(diff / (1e3 * 60 * 60 * 24));
}
function KGBPage() {
  const {
    data: user,
    loading: userLoading
  } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [kgbList, setKgbList] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
      return;
    }
    if (user) fetchProfile();
  }, [user, userLoading]);
  useEffect(() => {
    if (pegawai) fetchKGB();
  }, [pegawai]);
  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) {
      window.location.href = "/onboarding";
      return;
    }
    if (res.ok) {
      const d = await res.json();
      setPegawai(d.pegawai);
    }
  };
  const fetchKGB = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/kgb/list");
      if (res.ok) {
        const d = await res.json();
        setKgbList(d.kgb || []);
        setUpcoming(d.upcoming || []);
      }
    } finally {
      setLoading(false);
    }
  };
  if (userLoading || !pegawai) return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
    className: "flex min-h-screen items-center justify-center bg-[#F9FAFB]",
    renderId: "render-b52a15c0",
    as: "div",
    children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "text-sm text-[#6B7280]",
      renderId: "render-afa642bb",
      as: "div",
      children: "Memuat..."
    })
  });
  return /* @__PURE__ */ jsxs(AppLayout, {
    pegawai,
    activeHref: "/kgb",
    children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "flex items-center justify-between mb-6",
      renderId: "render-e41d2f93",
      as: "div",
      children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        renderId: "render-ec05cf70",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-2xl font-semibold text-[#111827] tracking-tight mb-1",
          renderId: "render-43e7e624",
          as: "h2",
          children: "Kenaikan Gaji Berkala (KGB)"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#6B7280]",
          renderId: "render-b55d5ac2",
          as: "p",
          children: "Monitoring dan early warning KGB pegawai"
        })]
      })
    }), upcoming.length > 0 && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "mb-6 p-4 bg-[#FFFBEB] border border-[#FCD34D] rounded-xl",
      renderId: "render-6e0a25b0",
      as: "div",
      children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "flex items-start gap-3",
        renderId: "render-ff3d8f1d",
        as: "div",
        children: [/* @__PURE__ */ jsx(Bell, {
          size: 20,
          className: "text-[#B45309] flex-shrink-0 mt-0.5"
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-510c08cd",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-sm font-semibold text-[#B45309] mb-1",
            renderId: "render-d5dcb00d",
            as: "p",
            children: "⚠️ Early Warning KGB"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "text-sm text-[#92400E]",
            renderId: "render-2d26c4e1",
            as: "p",
            children: [upcoming.length, " pegawai memiliki KGB yang jatuh tempo dalam 3 bulan ke depan atau sudah lewat jatuh tempo."]
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "mt-2 flex flex-wrap gap-2",
            renderId: "render-65a3ed2c",
            as: "div",
            children: upcoming.slice(0, 5).map((k) => {
              const days = getDaysUntil(k.tmt_kgb_baru);
              return /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "inline-flex items-center gap-1 px-2.5 py-1 bg-[#FEF3C7] text-[#92400E] text-xs rounded-full font-medium",
                renderId: "render-b97d07b8",
                as: "span",
                children: [k.nama_lengkap, " — ", days !== null ? days < 0 ? `${Math.abs(days)} hari lalu` : `${days} hari lagi` : "-"]
              }, k.id);
            })
          })]
        })]
      })
    }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "bg-white rounded-xl border border-[#E5E7EB] overflow-hidden",
      renderId: "render-5a5ffe8e",
      as: "div",
      children: loading ? /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "px-4 py-12 text-center text-sm text-[#6B7280]",
        renderId: "render-de09cbf5",
        as: "div",
        children: "Memuat data KGB..."
      }) : kgbList.length === 0 ? /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "px-4 py-16 text-center",
        renderId: "render-6186de2f",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4",
          renderId: "render-74282306",
          as: "div",
          children: /* @__PURE__ */ jsx(Calendar, {
            size: 32,
            className: "text-[#9CA3AF]"
          })
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm font-medium text-[#111827]",
          renderId: "render-280522e3",
          as: "p",
          children: "Belum ada data KGB"
        })]
      }) : /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "overflow-x-auto",
        renderId: "render-5639c954",
        as: "div",
        children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "w-full",
          renderId: "render-6f3880c5",
          as: "table",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            renderId: "render-1604c0c6",
            as: "thead",
            children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "bg-[#F9FAFB] border-b border-[#E5E7EB]",
              renderId: "render-86774787",
              as: "tr",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                renderId: "render-8d28fb8d",
                as: "th",
                children: "Pegawai"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                renderId: "render-c8ca6a74",
                as: "th",
                children: "TMT KGB Baru"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                renderId: "render-164d0cb7",
                as: "th",
                children: "Gaji Lama"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                renderId: "render-89e40a89",
                as: "th",
                children: "Gaji Baru"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                renderId: "render-8db68bf5",
                as: "th",
                children: "Masa Kerja (Gol)"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                renderId: "render-bb40fd26",
                as: "th",
                children: "Status"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                renderId: "render-21206fb9",
                as: "th",
                children: "Alert"
              })]
            })
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "divide-y divide-[#E5E7EB]",
            renderId: "render-ead2a561",
            as: "tbody",
            children: kgbList.map((k) => {
              const conf = STATUS_CONFIG$1[k.status] || STATUS_CONFIG$1.pending;
              const days = getDaysUntil(k.tmt_kgb_baru);
              const isWarning = k.is_upcoming || k.is_overdue;
              return /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: `hover:bg-[#F9FAFB] transition-colors ${isWarning ? "bg-[#FFFBEB]/50" : ""}`,
                renderId: "render-fcc728cd",
                as: "tr",
                children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                  className: "px-4 py-3",
                  renderId: "render-8a3ec750",
                  as: "td",
                  children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    className: "text-sm font-medium text-[#111827]",
                    renderId: "render-eeb68109",
                    as: "p",
                    children: k.nama_lengkap || pegawai.nama_lengkap
                  }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    className: "text-xs text-[#6B7280] font-mono",
                    renderId: "render-8848d4a7",
                    as: "p",
                    children: k.nip || pegawai.nip
                  })]
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#111827]",
                  renderId: "render-c7cf6f89",
                  as: "td",
                  children: k.tmt_kgb_baru ? new Date(k.tmt_kgb_baru).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  }) : "-"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#6B7280]",
                  renderId: "render-1fa01a00",
                  as: "td",
                  children: formatRupiah(k.gaji_lama)
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm font-semibold text-[#059669]",
                  renderId: "render-463417d2",
                  as: "td",
                  children: formatRupiah(k.gaji_baru)
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#6B7280]",
                  renderId: "render-56a5307b",
                  as: "td",
                  children: k.masa_kerja_golongan ? `${k.masa_kerja_golongan} tahun` : "-"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3",
                  renderId: "render-97c29d7c",
                  as: "td",
                  children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    className: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${conf.className}`,
                    renderId: "render-47ca4ce2",
                    as: "span",
                    children: conf.label
                  })
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3",
                  renderId: "render-d691ed13",
                  as: "td",
                  children: k.is_overdue ? /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                    className: "inline-flex items-center gap-1 text-xs text-[#DC2626] font-medium",
                    renderId: "render-c4a3db7a",
                    as: "span",
                    children: [/* @__PURE__ */ jsx(AlertTriangle, {
                      size: 12
                    }), " Terlambat"]
                  }) : k.is_upcoming ? /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                    className: "inline-flex items-center gap-1 text-xs text-[#B45309] font-medium",
                    renderId: "render-b6390a88",
                    as: "span",
                    children: [/* @__PURE__ */ jsx(Bell, {
                      size: 12
                    }), " ", days, " hari lagi"]
                  }) : /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    className: "text-xs text-[#9CA3AF]",
                    renderId: "render-3faca4bf",
                    as: "span",
                    children: "-"
                  })
                })]
              }, k.id);
            })
          })]
        })
      })
    })]
  });
}

const page$8 = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(KGBPage, {
      ...props
    })
  });
});

const route11 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$8
}, Symbol.toStringTag, { value: 'Module' }));

function OnboardingPage() {
  const {
    data: user,
    loading: userLoading
  } = useUser();
  const [nip, setNip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (!userLoading && !user) {
      if (typeof window !== "undefined") {
        window.location.href = "/account/signin";
      }
    }
  }, [user, userLoading]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!nip || nip.length !== 18) {
      setError("NIP harus terdiri dari 18 digit");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/pegawai/link-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nip
        })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal menghubungkan akun");
      }
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 2e3);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  if (userLoading) {
    return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "flex min-h-screen items-center justify-center bg-[#F9FAFB]",
      renderId: "render-95275859",
      as: "div",
      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "text-sm text-[#6B7280]",
        renderId: "render-6130a30d",
        as: "div",
        children: "Memuat..."
      })
    });
  }
  return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
    className: "flex min-h-screen w-full items-center justify-center bg-[#F9FAFB]",
    style: {
      fontFamily: "Inter, -apple-system, sans-serif"
    },
    renderId: "render-5f3e8ba2",
    as: "div",
    children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      onSubmit: handleSubmit,
      className: "w-full max-w-md bg-white rounded-xl border border-[#E5E7EB] p-8",
      renderId: "render-7627366f",
      as: "form",
      children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "flex items-center justify-center mb-8",
        renderId: "render-b3c25c33",
        as: "div",
        children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          src: "https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/",
          alt: "Logo Papua Barat Daya",
          className: "h-20 w-20 object-contain",
          renderId: "render-c7998f24",
          as: "img"
        })
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "text-2xl font-semibold text-[#111827] tracking-tight text-center mb-2",
        renderId: "render-65d80d3c",
        as: "h1",
        children: "Hubungkan Akun Pegawai"
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "text-sm text-[#6B7280] text-center mb-8",
        renderId: "render-18cfb880",
        as: "p",
        children: "Masukkan NIP Anda untuk melanjutkan"
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "space-y-5",
        renderId: "render-f598a074",
        as: "div",
        children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "space-y-2",
          renderId: "render-b4b081a2",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#111827]",
            renderId: "render-362e5443",
            as: "label",
            children: "NIP (18 Digit)"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            required: true,
            name: "nip",
            type: "text",
            maxLength: 18,
            value: nip,
            onChange: (e) => setNip(e.target.value.replace(/\D/g, "")),
            placeholder: "Contoh: 199001012020121001",
            className: "w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2",
            renderId: "render-e5ecc4e5",
            as: "input"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-xs text-[#6B7280]",
            renderId: "render-2fe6b16b",
            as: "p",
            children: "NIP harus sudah terdaftar di database pegawai"
          })]
        }), error && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600",
          renderId: "render-cc29e5cd",
          as: "div",
          children: error
        }), success && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-600",
          renderId: "render-7a0936d6",
          as: "div",
          children: "Berhasil! Mengalihkan ke dashboard..."
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          type: "submit",
          disabled: loading || success,
          className: "w-full rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:opacity-50",
          renderId: "render-5a04326e",
          as: "button",
          children: loading ? "Memproses..." : success ? "Berhasil!" : "Hubungkan"
        })]
      })]
    })
  });
}

const page$7 = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(OnboardingPage, {
      ...props
    })
  });
});

const route12 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$7
}, Symbol.toStringTag, { value: 'Module' }));

function PegawaiPage() {
  const {
    data: user,
    loading: userLoading
  } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (!userLoading && !user) {
      if (typeof window !== "undefined") {
        window.location.href = "/account/signin";
      }
      return;
    }
    if (user) {
      fetchProfile();
    }
  }, [user, userLoading]);
  useEffect(() => {
    if (pegawai) {
      fetchPegawaiList();
    }
  }, [pegawai, search, filterStatus]);
  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/pegawai/profile");
      if (res.status === 404) {
        if (typeof window !== "undefined") {
          window.location.href = "/onboarding";
        }
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPegawai(data.pegawai);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };
  const fetchPegawaiList = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterStatus) params.append("status", filterStatus);
      const res = await fetch(`/api/pegawai/list?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPegawaiList(data.pegawai || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Error fetching pegawai list:", err);
    } finally {
      setLoading(false);
    }
  };
  if (userLoading || !pegawai) {
    return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "flex min-h-screen items-center justify-center bg-[#F9FAFB]",
      renderId: "render-89dbf0cd",
      as: "div",
      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "text-sm text-[#6B7280]",
        renderId: "render-d341f591",
        as: "div",
        children: "Memuat..."
      })
    });
  }
  return /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
    className: "min-h-screen bg-[#F9FAFB]",
    style: {
      fontFamily: "Inter, -apple-system, sans-serif"
    },
    renderId: "render-479a415f",
    as: "div",
    children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "bg-white border-b border-[#E5E7EB]",
      renderId: "render-ca57640d",
      as: "div",
      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "max-w-7xl mx-auto px-6 py-4",
        renderId: "render-0e5bb4d1",
        as: "div",
        children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex items-center justify-between",
          renderId: "render-bc11e8e6",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-4",
            renderId: "render-de331232",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              src: "https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/",
              alt: "Logo",
              className: "h-12 w-12 object-contain",
              renderId: "render-a3b0d484",
              as: "img"
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-35931889",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-lg font-semibold text-[#111827] tracking-tight",
                renderId: "render-2b1d5906",
                as: "h1",
                children: "S-Kepegawaian"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-f6950725",
                as: "p",
                children: "Dinas PUPR Papua Barat Daya"
              })]
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-3 pl-4 border-l border-[#E5E7EB]",
            renderId: "render-73014d58",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "text-right",
              renderId: "render-27e07d0c",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm font-medium text-[#111827]",
                renderId: "render-b8fa37d6",
                as: "p",
                children: pegawai?.nama_lengkap
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-ea5cb2c4",
                as: "p",
                children: pegawai?.role === "admin" ? "Administrator" : pegawai?.role === "pimpinan" ? "Pimpinan" : "Pegawai"
              })]
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              href: "/account/logout",
              className: "text-xs text-[#6B7280] hover:text-[#2563EB]",
              renderId: "render-f87d2283",
              as: "a",
              children: "Keluar"
            })]
          })]
        })
      })
    }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "bg-white border-b border-[#E5E7EB]",
      renderId: "render-3a0015df",
      as: "div",
      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "max-w-7xl mx-auto px-6",
        renderId: "render-9b8a9041",
        as: "div",
        children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex gap-8",
          renderId: "render-a257565c",
          as: "nav",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: "/",
            className: "py-3 border-b-2 border-transparent text-sm text-[#6B7280] hover:text-[#111827] -mb-[1px]",
            renderId: "render-5b388710",
            as: "a",
            children: "Dashboard"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: "/pegawai",
            className: "py-3 border-b-2 border-[#2563EB] text-sm font-medium text-[#111827] -mb-[1px]",
            renderId: "render-c71a0eda",
            as: "a",
            children: "Data Pegawai"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: "/skp",
            className: "py-3 border-b-2 border-transparent text-sm text-[#6B7280] hover:text-[#111827] -mb-[1px]",
            renderId: "render-00428cd0",
            as: "a",
            children: "SKP"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: "/kgb",
            className: "py-3 border-b-2 border-transparent text-sm text-[#6B7280] hover:text-[#111827] -mb-[1px]",
            renderId: "render-6f23d3eb",
            as: "a",
            children: "KGB"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: "/kenaikan-pangkat",
            className: "py-3 border-b-2 border-transparent text-sm text-[#6B7280] hover:text-[#111827] -mb-[1px]",
            renderId: "render-d700b49d",
            as: "a",
            children: "Kenaikan Pangkat"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: "/cuti",
            className: "py-3 border-b-2 border-transparent text-sm text-[#6B7280] hover:text-[#111827] -mb-[1px]",
            renderId: "render-a3449ada",
            as: "a",
            children: "Cuti & Izin"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: "/dossier",
            className: "py-3 border-b-2 border-transparent text-sm text-[#6B7280] hover:text-[#111827] -mb-[1px]",
            renderId: "render-66019a95",
            as: "a",
            children: "Digital Dossier"
          })]
        })
      })
    }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "max-w-7xl mx-auto px-6 py-8",
      renderId: "render-63deef87",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "flex items-center justify-between mb-6",
        renderId: "render-64c26bc9",
        as: "div",
        children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-2fc810f0",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-2xl font-semibold text-[#111827] tracking-tight mb-1",
            renderId: "render-b21b3b18",
            as: "h2",
            children: "Data Pegawai"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-sm text-[#6B7280]",
            renderId: "render-8477c821",
            as: "p",
            children: "Kelola data kepegawaian"
          })]
        }), pegawai?.role === "admin" && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          href: "/pegawai/tambah",
          className: "inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors",
          renderId: "render-6a6a1814",
          as: "a",
          children: [/* @__PURE__ */ jsx(Plus, {
            size: 18
          }), "Tambah Pegawai"]
        })]
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "bg-white rounded-xl border border-[#E5E7EB] p-4 mb-6",
        renderId: "render-dc086b4e",
        as: "div",
        children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "grid grid-cols-1 md:grid-cols-3 gap-4",
          renderId: "render-9126af66",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "relative",
            renderId: "render-ad4cc03d",
            as: "div",
            children: [/* @__PURE__ */ jsx(Search, {
              size: 18,
              className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              type: "text",
              placeholder: "Cari nama atau NIP...",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
              renderId: "render-4916bc83",
              as: "input"
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            value: filterStatus,
            onChange: (e) => setFilterStatus(e.target.value),
            className: "px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
            renderId: "render-be856c97",
            as: "select",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              value: "",
              renderId: "render-a3bef79b",
              as: "option",
              children: "Semua Status"
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              value: "PNS",
              renderId: "render-ca76ebf7",
              as: "option",
              children: "PNS"
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              value: "CPNS",
              renderId: "render-1fb2539a",
              as: "option",
              children: "CPNS"
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              value: "PPPK",
              renderId: "render-8f53840c",
              as: "option",
              children: "PPPK"
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] hover:bg-[#F9FAFB] transition-colors",
            renderId: "render-96c4620f",
            as: "button",
            children: [/* @__PURE__ */ jsx(Download, {
              size: 18
            }), "Export Excel"]
          })]
        })
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6",
        renderId: "render-46479378",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "bg-white rounded-xl border border-[#E5E7EB] p-4",
          renderId: "render-c96cff86",
          as: "div",
          children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-3",
            renderId: "render-6a1f3a65",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center",
              renderId: "render-e2156346",
              as: "div",
              children: /* @__PURE__ */ jsx(Users, {
                size: 20,
                className: "text-[#2563EB]"
              })
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-8f597a34",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-e3ff6300",
                as: "p",
                children: "Total Pegawai"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xl font-semibold text-[#111827]",
                renderId: "render-2587a856",
                as: "p",
                children: total
              })]
            })]
          })
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "bg-white rounded-xl border border-[#E5E7EB] p-4",
          renderId: "render-ca6a2d34",
          as: "div",
          children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-3",
            renderId: "render-00de92a6",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center",
              renderId: "render-f24b7243",
              as: "div",
              children: /* @__PURE__ */ jsx(Users, {
                size: 20,
                className: "text-[#059669]"
              })
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-beea0c4e",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-6cb3d0c3",
                as: "p",
                children: "PNS"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xl font-semibold text-[#111827]",
                renderId: "render-0818735b",
                as: "p",
                children: pegawaiList.filter((p) => p.status_pegawai === "PNS").length
              })]
            })]
          })
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "bg-white rounded-xl border border-[#E5E7EB] p-4",
          renderId: "render-bf361bf6",
          as: "div",
          children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-3",
            renderId: "render-2899efce",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center",
              renderId: "render-bbd7eb8c",
              as: "div",
              children: /* @__PURE__ */ jsx(Users, {
                size: 20,
                className: "text-[#EA580C]"
              })
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-294c4c77",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-febac87c",
                as: "p",
                children: "CPNS"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xl font-semibold text-[#111827]",
                renderId: "render-2be3607e",
                as: "p",
                children: pegawaiList.filter((p) => p.status_pegawai === "CPNS").length
              })]
            })]
          })
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "bg-white rounded-xl border border-[#E5E7EB] p-4",
          renderId: "render-2563f7ac",
          as: "div",
          children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-3",
            renderId: "render-ccc9f49b",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center",
              renderId: "render-e19af591",
              as: "div",
              children: /* @__PURE__ */ jsx(Users, {
                size: 20,
                className: "text-[#6B7280]"
              })
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-67e8c309",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-38797991",
                as: "p",
                children: "PPPK"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xl font-semibold text-[#111827]",
                renderId: "render-99d2d248",
                as: "p",
                children: pegawaiList.filter((p) => p.status_pegawai === "PPPK").length
              })]
            })]
          })
        })]
      }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "bg-white rounded-xl border border-[#E5E7EB] overflow-hidden",
        renderId: "render-877faca9",
        as: "div",
        children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "overflow-x-auto",
          renderId: "render-babb9b0d",
          as: "div",
          children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "w-full",
            renderId: "render-f1c2d1b6",
            as: "table",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              renderId: "render-ff6d903d",
              as: "thead",
              children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "bg-[#F9FAFB] border-b border-[#E5E7EB]",
                renderId: "render-41d7bf28",
                as: "tr",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                  renderId: "render-63be291e",
                  as: "th",
                  children: "NIP"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                  renderId: "render-bc2da70b",
                  as: "th",
                  children: "Nama"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                  renderId: "render-eb743428",
                  as: "th",
                  children: "Jabatan"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                  renderId: "render-501c3444",
                  as: "th",
                  children: "Unit Kerja"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                  renderId: "render-381286f2",
                  as: "th",
                  children: "Pangkat/Gol"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                  renderId: "render-4ea5db7f",
                  as: "th",
                  children: "Status"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                  renderId: "render-a1840a0e",
                  as: "th",
                  children: "Aksi"
                })]
              })
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "divide-y divide-[#E5E7EB]",
              renderId: "render-a2b0245c",
              as: "tbody",
              children: loading ? /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                renderId: "render-069a61f7",
                as: "tr",
                children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  colSpan: "7",
                  className: "px-4 py-8 text-center text-sm text-[#6B7280]",
                  renderId: "render-0a55a74f",
                  as: "td",
                  children: "Memuat data..."
                })
              }) : pegawaiList.length === 0 ? /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                renderId: "render-fb02fcd6",
                as: "tr",
                children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  colSpan: "7",
                  className: "px-4 py-8 text-center text-sm text-[#6B7280]",
                  renderId: "render-6f95cf5b",
                  as: "td",
                  children: "Tidak ada data pegawai"
                })
              }) : pegawaiList.map((p) => /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "hover:bg-[#F9FAFB] transition-colors",
                renderId: "render-45c51eb3",
                as: "tr",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#111827] font-mono",
                  renderId: "render-ec53aeae",
                  as: "td",
                  children: p.nip
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#111827] font-medium",
                  renderId: "render-67b32225",
                  as: "td",
                  children: p.nama_lengkap
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#6B7280]",
                  renderId: "render-a98a1b55",
                  as: "td",
                  children: p.jabatan || "-"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#6B7280]",
                  renderId: "render-5d48e4db",
                  as: "td",
                  children: p.unit_kerja || "-"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#6B7280]",
                  renderId: "render-1f067a70",
                  as: "td",
                  children: p.pangkat && p.golongan ? `${p.pangkat} (${p.golongan})` : "-"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3",
                  renderId: "render-17852116",
                  as: "td",
                  children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${p.status_pegawai === "PNS" ? "bg-[#ECFDF5] text-[#059669]" : p.status_pegawai === "CPNS" ? "bg-[#FEF3C7] text-[#EA580C]" : "bg-[#F3F4F6] text-[#6B7280]"}`,
                    renderId: "render-e1ce3e2e",
                    as: "span",
                    children: p.status_pegawai
                  })
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3",
                  renderId: "render-69bca8d9",
                  as: "td",
                  children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                    className: "flex items-center gap-2",
                    renderId: "render-55fc98a8",
                    as: "div",
                    children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                      href: `/pegawai/${p.id}`,
                      className: "p-1.5 hover:bg-[#EFF6FF] rounded transition-colors",
                      title: "Lihat Detail",
                      renderId: "render-2d8fcee0",
                      as: "a",
                      children: /* @__PURE__ */ jsx(Eye, {
                        size: 16,
                        className: "text-[#6B7280]"
                      })
                    }), pegawai?.role === "admin" && /* @__PURE__ */ jsx(Fragment, {
                      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                        href: `/pegawai/${p.id}/edit`,
                        className: "p-1.5 hover:bg-[#EFF6FF] rounded transition-colors",
                        title: "Edit",
                        renderId: "render-953b08df",
                        as: "a",
                        children: /* @__PURE__ */ jsx(Edit, {
                          size: 16,
                          className: "text-[#6B7280]"
                        })
                      })
                    })]
                  })
                })]
              }, p.id))
            })]
          })
        })
      })]
    })]
  });
}

const page$6 = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(PegawaiPage, {
      ...props
    })
  });
});

const route13 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$6
}, Symbol.toStringTag, { value: 'Module' }));

function TambahPegawaiPage() {
  const {
    data: user,
    loading: userLoading
  } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nip: "",
    nama_lengkap: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    agama: "",
    status_pernikahan: "",
    alamat: "",
    no_telepon: "",
    email: "",
    status_pegawai: "PNS",
    golongan: "",
    pangkat: "",
    jabatan: "",
    unit_kerja: "",
    pendidikan_terakhir: "",
    jurusan: "",
    nama_institusi: "",
    tahun_lulus: "",
    tmt_cpns: "",
    tmt_pns: "",
    tmt_pangkat_terakhir: "",
    tmt_jabatan: "",
    role: "pegawai"
  });
  useEffect(() => {
    if (!userLoading && !user) {
      if (typeof window !== "undefined") {
        window.location.href = "/account/signin";
      }
      return;
    }
    if (user) {
      fetchProfile();
    }
  }, [user, userLoading]);
  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/pegawai/profile");
      if (res.status === 404) {
        if (typeof window !== "undefined") {
          window.location.href = "/onboarding";
        }
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPegawai(data.pegawai);
        if (data.pegawai.role !== "admin") {
          if (typeof window !== "undefined") {
            window.location.href = "/pegawai";
          }
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };
  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pegawai/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menambahkan pegawai");
      }
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/pegawai";
      }, 2e3);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  if (userLoading || !pegawai) {
    return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "flex min-h-screen items-center justify-center bg-[#F9FAFB]",
      renderId: "render-11b73fc6",
      as: "div",
      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "text-sm text-[#6B7280]",
        renderId: "render-0e60bf5e",
        as: "div",
        children: "Memuat..."
      })
    });
  }
  return /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
    className: "min-h-screen bg-[#F9FAFB]",
    style: {
      fontFamily: "Inter, -apple-system, sans-serif"
    },
    renderId: "render-c121f0f3",
    as: "div",
    children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "bg-white border-b border-[#E5E7EB]",
      renderId: "render-254f59d1",
      as: "div",
      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "max-w-7xl mx-auto px-6 py-4",
        renderId: "render-3cca75d2",
        as: "div",
        children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex items-center justify-between",
          renderId: "render-c7ac1ec9",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-4",
            renderId: "render-0c2007da",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              src: "https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/",
              alt: "Logo",
              className: "h-12 w-12 object-contain",
              renderId: "render-f0c892f7",
              as: "img"
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-c34aa7d3",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-lg font-semibold text-[#111827] tracking-tight",
                renderId: "render-af18b8f5",
                as: "h1",
                children: "S-Kepegawaian"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-e80b8f0f",
                as: "p",
                children: "Dinas PUPR Papua Barat Daya"
              })]
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-3 pl-4 border-l border-[#E5E7EB]",
            renderId: "render-bfc380b6",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "text-right",
              renderId: "render-aaf9e777",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm font-medium text-[#111827]",
                renderId: "render-e013939d",
                as: "p",
                children: pegawai?.nama_lengkap
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-97fe6756",
                as: "p",
                children: "Administrator"
              })]
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              href: "/account/logout",
              className: "text-xs text-[#6B7280] hover:text-[#2563EB]",
              renderId: "render-9d0f9a9d",
              as: "a",
              children: "Keluar"
            })]
          })]
        })
      })
    }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "max-w-4xl mx-auto px-6 py-8",
      renderId: "render-9cb278d9",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        href: "/pegawai",
        className: "inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] mb-6",
        renderId: "render-7aa69699",
        as: "a",
        children: [/* @__PURE__ */ jsx(ArrowLeft, {
          size: 16
        }), "Kembali ke Daftar Pegawai"]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "mb-6",
        renderId: "render-be1b9a4e",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-2xl font-semibold text-[#111827] tracking-tight mb-1",
          renderId: "render-05a18768",
          as: "h2",
          children: "Tambah Pegawai Baru"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#6B7280]",
          renderId: "render-59fa25e5",
          as: "p",
          children: "Lengkapi data pegawai di bawah ini"
        })]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        onSubmit: handleSubmit,
        className: "bg-white rounded-xl border border-[#E5E7EB] p-6",
        renderId: "render-df0fa891",
        as: "form",
        children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "mb-8",
          renderId: "render-5000879e",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-base font-semibold text-[#111827] mb-4 pb-2 border-b border-[#E5E7EB]",
            renderId: "render-c9ae1ed7",
            as: "h3",
            children: "Data Pribadi"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "grid grid-cols-1 md:grid-cols-2 gap-5",
            renderId: "render-8558907e",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "md:col-span-2",
              renderId: "render-36ede05b",
              as: "div",
              children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-cdde4615",
                as: "label",
                children: ["NIP ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-red-500",
                  renderId: "render-dcdd2ca2",
                  as: "span",
                  children: "*"
                })]
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "nip",
                value: formData.nip,
                onChange: handleChange,
                maxLength: 18,
                required: true,
                placeholder: "18 digit NIP",
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-5b64adc6",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "md:col-span-2",
              renderId: "render-dc025d3c",
              as: "div",
              children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-efa7c628",
                as: "label",
                children: ["Nama Lengkap ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-red-500",
                  renderId: "render-a6e66ef9",
                  as: "span",
                  children: "*"
                })]
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "nama_lengkap",
                value: formData.nama_lengkap,
                onChange: handleChange,
                required: true,
                placeholder: "Nama lengkap dengan gelar",
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-f3776515",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-5c64f260",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-f4415ffe",
                as: "label",
                children: "Tempat Lahir"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "tempat_lahir",
                value: formData.tempat_lahir,
                onChange: handleChange,
                placeholder: "Kota tempat lahir",
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-6180fd5e",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-904678fd",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-202dc784",
                as: "label",
                children: "Tanggal Lahir"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "date",
                name: "tanggal_lahir",
                value: formData.tanggal_lahir,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-95ac872c",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-b592833b",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-90632640",
                as: "label",
                children: "Jenis Kelamin"
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                name: "jenis_kelamin",
                value: formData.jenis_kelamin,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-4585a142",
                as: "select",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "",
                  renderId: "render-b725e2e1",
                  as: "option",
                  children: "Pilih"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Laki-laki",
                  renderId: "render-f8a6eccb",
                  as: "option",
                  children: "Laki-laki"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Perempuan",
                  renderId: "render-bc02b4a2",
                  as: "option",
                  children: "Perempuan"
                })]
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-ab8ca8ea",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-87f30c83",
                as: "label",
                children: "Agama"
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                name: "agama",
                value: formData.agama,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-16ef54d1",
                as: "select",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "",
                  renderId: "render-3088df0e",
                  as: "option",
                  children: "Pilih"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Islam",
                  renderId: "render-47eb7871",
                  as: "option",
                  children: "Islam"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Kristen",
                  renderId: "render-c70f7451",
                  as: "option",
                  children: "Kristen"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Katolik",
                  renderId: "render-4c453c84",
                  as: "option",
                  children: "Katolik"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Hindu",
                  renderId: "render-fca2e6d7",
                  as: "option",
                  children: "Hindu"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Buddha",
                  renderId: "render-7765b818",
                  as: "option",
                  children: "Buddha"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Konghucu",
                  renderId: "render-20f8e398",
                  as: "option",
                  children: "Konghucu"
                })]
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-320bc364",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-f2df5f6f",
                as: "label",
                children: "Status Pernikahan"
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                name: "status_pernikahan",
                value: formData.status_pernikahan,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-854e00fa",
                as: "select",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "",
                  renderId: "render-f08e2c84",
                  as: "option",
                  children: "Pilih"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Belum Menikah",
                  renderId: "render-6915fc30",
                  as: "option",
                  children: "Belum Menikah"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Menikah",
                  renderId: "render-6c59a860",
                  as: "option",
                  children: "Menikah"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Cerai Hidup",
                  renderId: "render-e9e3393e",
                  as: "option",
                  children: "Cerai Hidup"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Cerai Mati",
                  renderId: "render-06c581e0",
                  as: "option",
                  children: "Cerai Mati"
                })]
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-5c266513",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-856c91e0",
                as: "label",
                children: "No. Telepon"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "tel",
                name: "no_telepon",
                value: formData.no_telepon,
                onChange: handleChange,
                placeholder: "08xxxxxxxxxx",
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-fe71bd04",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "md:col-span-2",
              renderId: "render-0e10d227",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-a2a5f872",
                as: "label",
                children: "Email"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "email",
                name: "email",
                value: formData.email,
                onChange: handleChange,
                placeholder: "email@example.com",
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-d4a0ddaf",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "md:col-span-2",
              renderId: "render-ebd1d63b",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-6f6ff750",
                as: "label",
                children: "Alamat"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                name: "alamat",
                value: formData.alamat,
                onChange: handleChange,
                rows: 3,
                placeholder: "Alamat lengkap",
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-58460acd",
                as: "textarea"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "mb-8",
          renderId: "render-2aee85ab",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-base font-semibold text-[#111827] mb-4 pb-2 border-b border-[#E5E7EB]",
            renderId: "render-5a94b8a4",
            as: "h3",
            children: "Data Kepegawaian"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "grid grid-cols-1 md:grid-cols-2 gap-5",
            renderId: "render-8370d98a",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-67ea2ba7",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-21bd8e76",
                as: "label",
                children: "Status Pegawai"
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                name: "status_pegawai",
                value: formData.status_pegawai,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-2c52b014",
                as: "select",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "PNS",
                  renderId: "render-0620bf59",
                  as: "option",
                  children: "PNS"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "CPNS",
                  renderId: "render-5893ea76",
                  as: "option",
                  children: "CPNS"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "PPPK",
                  renderId: "render-a8c36097",
                  as: "option",
                  children: "PPPK"
                })]
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-9d68d60a",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-ff290475",
                as: "label",
                children: "Golongan"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "golongan",
                value: formData.golongan,
                onChange: handleChange,
                placeholder: "Contoh: III/d",
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-594e3dde",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "md:col-span-2",
              renderId: "render-b6fdbd17",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-5e5375be",
                as: "label",
                children: "Pangkat"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "pangkat",
                value: formData.pangkat,
                onChange: handleChange,
                placeholder: "Contoh: Penata Tingkat I",
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-74a12650",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "md:col-span-2",
              renderId: "render-a47b5c15",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-73b4ba04",
                as: "label",
                children: "Jabatan"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "jabatan",
                value: formData.jabatan,
                onChange: handleChange,
                placeholder: "Jabatan saat ini",
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-f948080d",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "md:col-span-2",
              renderId: "render-89a33dd5",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-d8ef92dd",
                as: "label",
                children: "Unit Kerja"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "unit_kerja",
                value: formData.unit_kerja,
                onChange: handleChange,
                placeholder: "Bidang/Bagian",
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-e9315f84",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-90899ef8",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-c8e10c07",
                as: "label",
                children: "TMT CPNS"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "date",
                name: "tmt_cpns",
                value: formData.tmt_cpns,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-8beef358",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-1c56480e",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-4da80a36",
                as: "label",
                children: "TMT PNS"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "date",
                name: "tmt_pns",
                value: formData.tmt_pns,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-d5af13c6",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-c7d6fe6c",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-3aa69630",
                as: "label",
                children: "TMT Pangkat Terakhir"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "date",
                name: "tmt_pangkat_terakhir",
                value: formData.tmt_pangkat_terakhir,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-cd87eb78",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-4af958a7",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-e3dac525",
                as: "label",
                children: "TMT Jabatan"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "date",
                name: "tmt_jabatan",
                value: formData.tmt_jabatan,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-62a3904c",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-bc7f81e9",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-ba994e8f",
                as: "label",
                children: "Role Akses Sistem"
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                name: "role",
                value: formData.role,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-b0dac38c",
                as: "select",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "pegawai",
                  renderId: "render-780ad065",
                  as: "option",
                  children: "Pegawai"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "admin",
                  renderId: "render-441c3f27",
                  as: "option",
                  children: "Administrator"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "pimpinan",
                  renderId: "render-4e69ad30",
                  as: "option",
                  children: "Pimpinan"
                })]
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "mb-8",
          renderId: "render-2d8a3861",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-base font-semibold text-[#111827] mb-4 pb-2 border-b border-[#E5E7EB]",
            renderId: "render-e1a80d3b",
            as: "h3",
            children: "Data Pendidikan"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "grid grid-cols-1 md:grid-cols-2 gap-5",
            renderId: "render-0e2c70cc",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-135c6ac6",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-2bf91ca8",
                as: "label",
                children: "Pendidikan Terakhir"
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                name: "pendidikan_terakhir",
                value: formData.pendidikan_terakhir,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-8dcf806d",
                as: "select",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "",
                  renderId: "render-c51d3c3f",
                  as: "option",
                  children: "Pilih"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "SMA/SMK",
                  renderId: "render-561fccd6",
                  as: "option",
                  children: "SMA/SMK"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "D3",
                  renderId: "render-7a89174e",
                  as: "option",
                  children: "D3"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "S1",
                  renderId: "render-acf6ef51",
                  as: "option",
                  children: "S1"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "S2",
                  renderId: "render-9ef320c1",
                  as: "option",
                  children: "S2"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "S3",
                  renderId: "render-50d3d305",
                  as: "option",
                  children: "S3"
                })]
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-5c3515c9",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-21aace58",
                as: "label",
                children: "Jurusan"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "jurusan",
                value: formData.jurusan,
                onChange: handleChange,
                placeholder: "Jurusan/Program Studi",
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-20f5a66a",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-e5cfa73a",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-a3624f21",
                as: "label",
                children: "Nama Institusi"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "nama_institusi",
                value: formData.nama_institusi,
                onChange: handleChange,
                placeholder: "Nama Universitas/Sekolah",
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-b8ec805b",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-011a3913",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-6b831602",
                as: "label",
                children: "Tahun Lulus"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "number",
                name: "tahun_lulus",
                value: formData.tahun_lulus,
                onChange: handleChange,
                placeholder: "2020",
                min: "1950",
                max: "2030",
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-c4ac70a8",
                as: "input"
              })]
            })]
          })]
        }), error && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600",
          renderId: "render-601c8bce",
          as: "div",
          children: error
        }), success && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-600",
          renderId: "render-31d26a9a",
          as: "div",
          children: "Pegawai berhasil ditambahkan! Mengalihkan..."
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex items-center gap-3 pt-6 border-t border-[#E5E7EB]",
          renderId: "render-c8477f50",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            type: "submit",
            disabled: loading || success,
            className: "px-6 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors disabled:opacity-50",
            renderId: "render-68e6e019",
            as: "button",
            children: loading ? "Menyimpan..." : "Simpan Data"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: "/pegawai",
            className: "px-6 py-2.5 border border-[#E5E7EB] text-[#111827] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors",
            renderId: "render-fa4d304e",
            as: "a",
            children: "Batal"
          })]
        })]
      })]
    })]
  });
}

const page$5 = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(TambahPegawaiPage, {
      ...props
    })
  });
});

const route14 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$5
}, Symbol.toStringTag, { value: 'Module' }));

function DetailPegawaiPage({
  params
}) {
  const {
    data: user,
    loading: userLoading
  } = useUser();
  const [currentPegawai, setCurrentPegawai] = useState(null);
  const [detailPegawai, setDetailPegawai] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!userLoading && !user) {
      if (typeof window !== "undefined") {
        window.location.href = "/account/signin";
      }
      return;
    }
    if (user) {
      fetchData();
    }
  }, [user, userLoading, params.id]);
  const fetchData = async () => {
    try {
      const [profileRes, detailRes] = await Promise.all([fetch("/api/pegawai/profile"), fetch(`/api/pegawai/${params.id}`)]);
      if (profileRes.status === 404) {
        if (typeof window !== "undefined") {
          window.location.href = "/onboarding";
        }
        return;
      }
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setCurrentPegawai(profileData.pegawai);
      }
      if (detailRes.ok) {
        const detailData = await detailRes.json();
        setDetailPegawai(detailData.pegawai);
      } else {
        setError("Pegawai tidak ditemukan");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  if (userLoading || loading) {
    return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "flex min-h-screen items-center justify-center bg-[#F9FAFB]",
      renderId: "render-7682de4a",
      as: "div",
      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "text-sm text-[#6B7280]",
        renderId: "render-6d23aa11",
        as: "div",
        children: "Memuat..."
      })
    });
  }
  if (error) {
    return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "flex min-h-screen items-center justify-center bg-[#F9FAFB]",
      renderId: "render-fdcafdd9",
      as: "div",
      children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "text-center",
        renderId: "render-06871f3f",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-red-600 mb-4",
          renderId: "render-6a18a07a",
          as: "p",
          children: error
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          href: "/pegawai",
          className: "text-sm text-[#2563EB] hover:text-[#1D4ED8]",
          renderId: "render-128fdcc6",
          as: "a",
          children: "Kembali ke Daftar Pegawai"
        })]
      })
    });
  }
  return /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
    className: "min-h-screen bg-[#F9FAFB]",
    style: {
      fontFamily: "Inter, -apple-system, sans-serif"
    },
    renderId: "render-2814e308",
    as: "div",
    children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "bg-white border-b border-[#E5E7EB]",
      renderId: "render-063e2478",
      as: "div",
      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "max-w-7xl mx-auto px-6 py-4",
        renderId: "render-5cf81094",
        as: "div",
        children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex items-center justify-between",
          renderId: "render-80f92516",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-4",
            renderId: "render-c0cac494",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              src: "https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/",
              alt: "Logo",
              className: "h-12 w-12 object-contain",
              renderId: "render-03ef6ed5",
              as: "img"
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-7a83cfd6",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-lg font-semibold text-[#111827] tracking-tight",
                renderId: "render-3c97a96b",
                as: "h1",
                children: "S-Kepegawaian"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-d4b338e5",
                as: "p",
                children: "Dinas PUPR Papua Barat Daya"
              })]
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-3 pl-4 border-l border-[#E5E7EB]",
            renderId: "render-0be4f103",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "text-right",
              renderId: "render-1cc7d4b6",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm font-medium text-[#111827]",
                renderId: "render-731d5b29",
                as: "p",
                children: currentPegawai?.nama_lengkap
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-13c30dab",
                as: "p",
                children: currentPegawai?.role === "admin" ? "Administrator" : currentPegawai?.role === "pimpinan" ? "Pimpinan" : "Pegawai"
              })]
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              href: "/account/logout",
              className: "text-xs text-[#6B7280] hover:text-[#2563EB]",
              renderId: "render-a7457bb4",
              as: "a",
              children: "Keluar"
            })]
          })]
        })
      })
    }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "max-w-5xl mx-auto px-6 py-8",
      renderId: "render-09c13aaa",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        href: "/pegawai",
        className: "inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] mb-6",
        renderId: "render-1cafa5dc",
        as: "a",
        children: [/* @__PURE__ */ jsx(ArrowLeft, {
          size: 16
        }), "Kembali ke Daftar Pegawai"]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6",
        renderId: "render-bff67c6f",
        as: "div",
        children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex items-start justify-between mb-6",
          renderId: "render-a085a114",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-start gap-6",
            renderId: "render-8cb71242",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "w-24 h-24 rounded-full bg-[#EFF6FF] flex items-center justify-center text-3xl font-semibold text-[#2563EB]",
              renderId: "render-5e38d83b",
              as: "div",
              children: detailPegawai?.nama_lengkap?.charAt(0)
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-2f6088d9",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-2xl font-semibold text-[#111827] mb-1",
                renderId: "render-18c3f2e3",
                as: "h2",
                children: detailPegawai?.nama_lengkap
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "text-sm text-[#6B7280] mb-3",
                renderId: "render-8af9d051",
                as: "p",
                children: ["NIP: ", detailPegawai?.nip]
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "flex items-center gap-4",
                renderId: "render-7f41cb64",
                as: "div",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${detailPegawai?.status_pegawai === "PNS" ? "bg-[#ECFDF5] text-[#059669]" : detailPegawai?.status_pegawai === "CPNS" ? "bg-[#FEF3C7] text-[#EA580C]" : "bg-[#F3F4F6] text-[#6B7280]"}`,
                  renderId: "render-cfa8bcfc",
                  as: "span",
                  children: detailPegawai?.status_pegawai
                }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                  className: "text-sm text-[#6B7280]",
                  renderId: "render-a4e0fa4c",
                  as: "span",
                  children: [detailPegawai?.pangkat, " (", detailPegawai?.golongan, ")"]
                })]
              })]
            })]
          }), currentPegawai?.role === "admin" && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            href: `/pegawai/${params.id}/edit`,
            className: "inline-flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#111827] hover:bg-[#F9FAFB] transition-colors",
            renderId: "render-f6885a88",
            as: "a",
            children: [/* @__PURE__ */ jsx(Edit, {
              size: 16
            }), "Edit Data"]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#E5E7EB]",
          renderId: "render-de48b37d",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-3",
            renderId: "render-64d0e8ec",
            as: "div",
            children: [/* @__PURE__ */ jsx(Briefcase, {
              size: 18,
              className: "text-[#6B7280]"
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-32b03968",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-2f96b5a5",
                as: "p",
                children: "Jabatan"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm font-medium text-[#111827]",
                renderId: "render-a76459b2",
                as: "p",
                children: detailPegawai?.jabatan || "-"
              })]
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-3",
            renderId: "render-048ff68d",
            as: "div",
            children: [/* @__PURE__ */ jsx(MapPin, {
              size: 18,
              className: "text-[#6B7280]"
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-8a12ae17",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-55228fc9",
                as: "p",
                children: "Unit Kerja"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm font-medium text-[#111827]",
                renderId: "render-a6f8df3b",
                as: "p",
                children: detailPegawai?.unit_kerja || "-"
              })]
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-3",
            renderId: "render-ff5ae035",
            as: "div",
            children: [/* @__PURE__ */ jsx(GraduationCap, {
              size: 18,
              className: "text-[#6B7280]"
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-6a0bb1ce",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-d9845610",
                as: "p",
                children: "Pendidikan"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm font-medium text-[#111827]",
                renderId: "render-4b037074",
                as: "p",
                children: detailPegawai?.pendidikan_terakhir || "-"
              })]
            })]
          })]
        })]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
        renderId: "render-3d0b5dcc",
        as: "div",
        children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "bg-white rounded-xl border border-[#E5E7EB] p-6",
          renderId: "render-ee8c04ba",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-base font-semibold text-[#111827] mb-4 pb-3 border-b border-[#E5E7EB]",
            renderId: "render-edb7df47",
            as: "h3",
            children: "Data Pribadi"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "space-y-4",
            renderId: "render-dd42abe2",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-b85dae0d",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280] mb-1",
                renderId: "render-f96aa233",
                as: "p",
                children: "Tempat, Tanggal Lahir"
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-9b3e3f79",
                as: "p",
                children: [detailPegawai?.tempat_lahir || "-", ",", " ", formatDate(detailPegawai?.tanggal_lahir)]
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-3788c82d",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280] mb-1",
                renderId: "render-e4ea8c12",
                as: "p",
                children: "Jenis Kelamin"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-0e9fa3de",
                as: "p",
                children: detailPegawai?.jenis_kelamin || "-"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-6f38b7d4",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280] mb-1",
                renderId: "render-39448406",
                as: "p",
                children: "Agama"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-7eecbf12",
                as: "p",
                children: detailPegawai?.agama || "-"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-0028bcb9",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280] mb-1",
                renderId: "render-de58ef18",
                as: "p",
                children: "Status Pernikahan"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-db3ab92a",
                as: "p",
                children: detailPegawai?.status_pernikahan || "-"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-5a0c35f2",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280] mb-1",
                renderId: "render-3718defe",
                as: "p",
                children: "Alamat"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-06627c24",
                as: "p",
                children: detailPegawai?.alamat || "-"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "flex items-center gap-2",
              renderId: "render-94b0f7f9",
              as: "div",
              children: [/* @__PURE__ */ jsx(Phone, {
                size: 14,
                className: "text-[#6B7280]"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-07bd4a4f",
                as: "p",
                children: detailPegawai?.no_telepon || "-"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "flex items-center gap-2",
              renderId: "render-1ef2b5e4",
              as: "div",
              children: [/* @__PURE__ */ jsx(Mail, {
                size: 14,
                className: "text-[#6B7280]"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-97f5123c",
                as: "p",
                children: detailPegawai?.email || "-"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "bg-white rounded-xl border border-[#E5E7EB] p-6",
          renderId: "render-cfbcdf58",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-base font-semibold text-[#111827] mb-4 pb-3 border-b border-[#E5E7EB]",
            renderId: "render-08a0fe2d",
            as: "h3",
            children: "Data Kepegawaian"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "space-y-4",
            renderId: "render-50d12200",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-20459d0a",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280] mb-1",
                renderId: "render-54c317c0",
                as: "p",
                children: "Status Pegawai"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-739a1c6e",
                as: "p",
                children: detailPegawai?.status_pegawai || "-"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-a140138e",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280] mb-1",
                renderId: "render-c5a8e882",
                as: "p",
                children: "Pangkat / Golongan"
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-193f1268",
                as: "p",
                children: [detailPegawai?.pangkat || "-", " /", " ", detailPegawai?.golongan || "-"]
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-bbe003cb",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280] mb-1",
                renderId: "render-cdb29112",
                as: "p",
                children: "TMT CPNS"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-9a6faaf2",
                as: "p",
                children: formatDate(detailPegawai?.tmt_cpns)
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-2a9bc727",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280] mb-1",
                renderId: "render-2f8dd8fe",
                as: "p",
                children: "TMT PNS"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-c05fab7c",
                as: "p",
                children: formatDate(detailPegawai?.tmt_pns)
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-809d9c24",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280] mb-1",
                renderId: "render-66cc0a4f",
                as: "p",
                children: "TMT Pangkat Terakhir"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-a815f71a",
                as: "p",
                children: formatDate(detailPegawai?.tmt_pangkat_terakhir)
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-ae115a66",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280] mb-1",
                renderId: "render-97d44352",
                as: "p",
                children: "TMT Jabatan"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-93df5991",
                as: "p",
                children: formatDate(detailPegawai?.tmt_jabatan)
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "bg-white rounded-xl border border-[#E5E7EB] p-6",
          renderId: "render-cc0a6610",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-base font-semibold text-[#111827] mb-4 pb-3 border-b border-[#E5E7EB]",
            renderId: "render-08dc2044",
            as: "h3",
            children: "Data Pendidikan"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "space-y-4",
            renderId: "render-c6756d3c",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-d68068f2",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280] mb-1",
                renderId: "render-adcb69d7",
                as: "p",
                children: "Pendidikan Terakhir"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-54c364bf",
                as: "p",
                children: detailPegawai?.pendidikan_terakhir || "-"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-23c5e39f",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280] mb-1",
                renderId: "render-a156c3cd",
                as: "p",
                children: "Jurusan"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-2eaff0c7",
                as: "p",
                children: detailPegawai?.jurusan || "-"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-3ffce30b",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280] mb-1",
                renderId: "render-e609f133",
                as: "p",
                children: "Nama Institusi"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-9e4c1c2d",
                as: "p",
                children: detailPegawai?.nama_institusi || "-"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-4d350c51",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280] mb-1",
                renderId: "render-7fe2d032",
                as: "p",
                children: "Tahun Lulus"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-e396ef66",
                as: "p",
                children: detailPegawai?.tahun_lulus || "-"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "bg-white rounded-xl border border-[#E5E7EB] p-6",
          renderId: "render-277dff34",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-base font-semibold text-[#111827] mb-4 pb-3 border-b border-[#E5E7EB]",
            renderId: "render-0266e726",
            as: "h3",
            children: "Akses Cepat"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "space-y-2",
            renderId: "render-05683968",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              href: `/skp?pegawai=${params.id}`,
              className: "flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all",
              renderId: "render-d7123f5d",
              as: "a",
              children: [/* @__PURE__ */ jsx(FileText, {
                size: 18,
                className: "text-[#6B7280]"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-55412458",
                as: "span",
                children: "Lihat SKP"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              href: `/kgb?pegawai=${params.id}`,
              className: "flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all",
              renderId: "render-f4672e65",
              as: "a",
              children: [/* @__PURE__ */ jsx(Calendar, {
                size: 18,
                className: "text-[#6B7280]"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-06bd7c44",
                as: "span",
                children: "Riwayat KGB"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              href: `/kenaikan-pangkat?pegawai=${params.id}`,
              className: "flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all",
              renderId: "render-8146372e",
              as: "a",
              children: [/* @__PURE__ */ jsx(Briefcase, {
                size: 18,
                className: "text-[#6B7280]"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-a8be2074",
                as: "span",
                children: "Riwayat Kenaikan Pangkat"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              href: `/dossier?pegawai=${params.id}`,
              className: "flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all",
              renderId: "render-b3f36650",
              as: "a",
              children: [/* @__PURE__ */ jsx(FileText, {
                size: 18,
                className: "text-[#6B7280]"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm text-[#111827]",
                renderId: "render-cf9aedbd",
                as: "span",
                children: "Lihat Dossier"
              })]
            })]
          })]
        })]
      })]
    })]
  });
}

const page$4 = UNSAFE_withComponentProps(function WrappedPage(props) {
  const params = useParams();
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(DetailPegawaiPage, {
      ...props,
      id: params.id
    })
  });
});

const route15 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$4
}, Symbol.toStringTag, { value: 'Module' }));

function EditPegawaiPage({
  params
}) {
  const {
    data: user,
    loading: userLoading
  } = useUser();
  const [currentPegawai, setCurrentPegawai] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    agama: "",
    status_pernikahan: "",
    alamat: "",
    no_telepon: "",
    email: "",
    status_pegawai: "PNS",
    golongan: "",
    pangkat: "",
    jabatan: "",
    unit_kerja: "",
    pendidikan_terakhir: "",
    jurusan: "",
    nama_institusi: "",
    tahun_lulus: "",
    tmt_cpns: "",
    tmt_pns: "",
    tmt_pangkat_terakhir: "",
    tmt_jabatan: "",
    role: "pegawai"
  });
  useEffect(() => {
    if (!userLoading && !user) {
      if (typeof window !== "undefined") {
        window.location.href = "/account/signin";
      }
      return;
    }
    if (user) {
      fetchData();
    }
  }, [user, userLoading, params.id]);
  const fetchData = async () => {
    try {
      const [profileRes, detailRes] = await Promise.all([fetch("/api/pegawai/profile"), fetch(`/api/pegawai/${params.id}`)]);
      if (profileRes.status === 404) {
        if (typeof window !== "undefined") {
          window.location.href = "/onboarding";
        }
        return;
      }
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setCurrentPegawai(profileData.pegawai);
        if (profileData.pegawai.role !== "admin") {
          if (typeof window !== "undefined") {
            window.location.href = "/pegawai";
          }
          return;
        }
      }
      if (detailRes.ok) {
        const detailData = await detailRes.json();
        const p = detailData.pegawai;
        setFormData({
          nama_lengkap: p.nama_lengkap || "",
          tempat_lahir: p.tempat_lahir || "",
          tanggal_lahir: p.tanggal_lahir || "",
          jenis_kelamin: p.jenis_kelamin || "",
          agama: p.agama || "",
          status_pernikahan: p.status_pernikahan || "",
          alamat: p.alamat || "",
          no_telepon: p.no_telepon || "",
          email: p.email || "",
          status_pegawai: p.status_pegawai || "PNS",
          golongan: p.golongan || "",
          pangkat: p.pangkat || "",
          jabatan: p.jabatan || "",
          unit_kerja: p.unit_kerja || "",
          pendidikan_terakhir: p.pendidikan_terakhir || "",
          jurusan: p.jurusan || "",
          nama_institusi: p.nama_institusi || "",
          tahun_lulus: p.tahun_lulus || "",
          tmt_cpns: p.tmt_cpns || "",
          tmt_pns: p.tmt_pns || "",
          tmt_pangkat_terakhir: p.tmt_pangkat_terakhir || "",
          tmt_jabatan: p.tmt_jabatan || "",
          role: p.role || "pegawai"
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/pegawai/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengupdate pegawai");
      }
      setSuccess(true);
      setTimeout(() => {
        window.location.href = `/pegawai/${params.id}`;
      }, 1500);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };
  if (userLoading || loading) {
    return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "flex min-h-screen items-center justify-center bg-[#F9FAFB]",
      renderId: "render-00ab6f14",
      as: "div",
      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "text-sm text-[#6B7280]",
        renderId: "render-c0124eb2",
        as: "div",
        children: "Memuat..."
      })
    });
  }
  return /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
    className: "min-h-screen bg-[#F9FAFB]",
    style: {
      fontFamily: "Inter, -apple-system, sans-serif"
    },
    renderId: "render-02990f6e",
    as: "div",
    children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "bg-white border-b border-[#E5E7EB]",
      renderId: "render-73c11f66",
      as: "div",
      children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "max-w-7xl mx-auto px-6 py-4",
        renderId: "render-b9af6fc9",
        as: "div",
        children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex items-center justify-between",
          renderId: "render-55e7fb5f",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-4",
            renderId: "render-9eee7c7a",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              src: "https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/",
              alt: "Logo",
              className: "h-12 w-12 object-contain",
              renderId: "render-99a8ebda",
              as: "img"
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-c2c04ddb",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-lg font-semibold text-[#111827] tracking-tight",
                renderId: "render-8e488da3",
                as: "h1",
                children: "S-Kepegawaian"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-25206207",
                as: "p",
                children: "Dinas PUPR Papua Barat Daya"
              })]
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "flex items-center gap-3 pl-4 border-l border-[#E5E7EB]",
            renderId: "render-6eca98e2",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "text-right",
              renderId: "render-a4117a17",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm font-medium text-[#111827]",
                renderId: "render-200d44ca",
                as: "p",
                children: currentPegawai?.nama_lengkap
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-0f32874f",
                as: "p",
                children: "Administrator"
              })]
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              href: "/account/logout",
              className: "text-xs text-[#6B7280] hover:text-[#2563EB]",
              renderId: "render-69cc4af7",
              as: "a",
              children: "Keluar"
            })]
          })]
        })
      })
    }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "max-w-4xl mx-auto px-6 py-8",
      renderId: "render-6ded40ad",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        href: `/pegawai/${params.id}`,
        className: "inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] mb-6",
        renderId: "render-f097154a",
        as: "a",
        children: [/* @__PURE__ */ jsx(ArrowLeft, {
          size: 16
        }), "Kembali ke Detail Pegawai"]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "mb-6",
        renderId: "render-6852e5e9",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-2xl font-semibold text-[#111827] tracking-tight mb-1",
          renderId: "render-c3f11547",
          as: "h2",
          children: "Edit Data Pegawai"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#6B7280]",
          renderId: "render-e296b597",
          as: "p",
          children: "Update informasi pegawai"
        })]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        onSubmit: handleSubmit,
        className: "bg-white rounded-xl border border-[#E5E7EB] p-6",
        renderId: "render-70b2ed23",
        as: "form",
        children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "mb-8",
          renderId: "render-3331aca0",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-base font-semibold text-[#111827] mb-4 pb-2 border-b border-[#E5E7EB]",
            renderId: "render-3c7d8b70",
            as: "h3",
            children: "Data Pribadi"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "grid grid-cols-1 md:grid-cols-2 gap-5",
            renderId: "render-74ee2ef9",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "md:col-span-2",
              renderId: "render-c20aa685",
              as: "div",
              children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-ac039c71",
                as: "label",
                children: ["Nama Lengkap ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-red-500",
                  renderId: "render-2bc06041",
                  as: "span",
                  children: "*"
                })]
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "nama_lengkap",
                value: formData.nama_lengkap,
                onChange: handleChange,
                required: true,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-c3e11372",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-b3f41b0a",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-9ede57d4",
                as: "label",
                children: "Tempat Lahir"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "tempat_lahir",
                value: formData.tempat_lahir,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-048fdb41",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-7facea6b",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-19580f9a",
                as: "label",
                children: "Tanggal Lahir"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "date",
                name: "tanggal_lahir",
                value: formData.tanggal_lahir,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-dc036905",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-a2106ca4",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-52043c16",
                as: "label",
                children: "Jenis Kelamin"
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                name: "jenis_kelamin",
                value: formData.jenis_kelamin,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-aa021a3e",
                as: "select",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "",
                  renderId: "render-0b117cb7",
                  as: "option",
                  children: "Pilih"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Laki-laki",
                  renderId: "render-7f4d45c0",
                  as: "option",
                  children: "Laki-laki"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Perempuan",
                  renderId: "render-42416ca2",
                  as: "option",
                  children: "Perempuan"
                })]
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-755334a3",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-3d7aed0f",
                as: "label",
                children: "Agama"
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                name: "agama",
                value: formData.agama,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-37d5fd2b",
                as: "select",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "",
                  renderId: "render-bee11ad6",
                  as: "option",
                  children: "Pilih"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Islam",
                  renderId: "render-6a042f30",
                  as: "option",
                  children: "Islam"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Kristen",
                  renderId: "render-b9be9c45",
                  as: "option",
                  children: "Kristen"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Katolik",
                  renderId: "render-9f68c074",
                  as: "option",
                  children: "Katolik"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Hindu",
                  renderId: "render-e02902e5",
                  as: "option",
                  children: "Hindu"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Buddha",
                  renderId: "render-e4a135fe",
                  as: "option",
                  children: "Buddha"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Konghucu",
                  renderId: "render-f376f37b",
                  as: "option",
                  children: "Konghucu"
                })]
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-21ba68d4",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-80a9e7b8",
                as: "label",
                children: "Status Pernikahan"
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                name: "status_pernikahan",
                value: formData.status_pernikahan,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-48ff691b",
                as: "select",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "",
                  renderId: "render-e38407d7",
                  as: "option",
                  children: "Pilih"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Belum Menikah",
                  renderId: "render-87d0f8d9",
                  as: "option",
                  children: "Belum Menikah"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Menikah",
                  renderId: "render-02f9c1a5",
                  as: "option",
                  children: "Menikah"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Cerai Hidup",
                  renderId: "render-9b6d09a2",
                  as: "option",
                  children: "Cerai Hidup"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "Cerai Mati",
                  renderId: "render-15b2304f",
                  as: "option",
                  children: "Cerai Mati"
                })]
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-89b8a7cb",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-475c7c07",
                as: "label",
                children: "No. Telepon"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "tel",
                name: "no_telepon",
                value: formData.no_telepon,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-46a369ed",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "md:col-span-2",
              renderId: "render-f99c8872",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-4d300c6d",
                as: "label",
                children: "Email"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "email",
                name: "email",
                value: formData.email,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-1f8bf94a",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "md:col-span-2",
              renderId: "render-bc708933",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-3e4b5998",
                as: "label",
                children: "Alamat"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                name: "alamat",
                value: formData.alamat,
                onChange: handleChange,
                rows: 3,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-ede6d0e2",
                as: "textarea"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "mb-8",
          renderId: "render-cffdcbcd",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-base font-semibold text-[#111827] mb-4 pb-2 border-b border-[#E5E7EB]",
            renderId: "render-29406223",
            as: "h3",
            children: "Data Kepegawaian"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "grid grid-cols-1 md:grid-cols-2 gap-5",
            renderId: "render-f28da00e",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-c283a0aa",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-9de969cb",
                as: "label",
                children: "Status Pegawai"
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                name: "status_pegawai",
                value: formData.status_pegawai,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-4430085a",
                as: "select",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "PNS",
                  renderId: "render-d5e30d6e",
                  as: "option",
                  children: "PNS"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "CPNS",
                  renderId: "render-0933ccff",
                  as: "option",
                  children: "CPNS"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "PPPK",
                  renderId: "render-fa6cdac5",
                  as: "option",
                  children: "PPPK"
                })]
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-fd625352",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-075f87e0",
                as: "label",
                children: "Golongan"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "golongan",
                value: formData.golongan,
                onChange: handleChange,
                placeholder: "Contoh: III/d",
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-747fae4e",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "md:col-span-2",
              renderId: "render-35c10424",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-d427f742",
                as: "label",
                children: "Pangkat"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "pangkat",
                value: formData.pangkat,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-e8178ffd",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "md:col-span-2",
              renderId: "render-2588b719",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-ac6473d7",
                as: "label",
                children: "Jabatan"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "jabatan",
                value: formData.jabatan,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-c9105fca",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "md:col-span-2",
              renderId: "render-55910248",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-84d34fa5",
                as: "label",
                children: "Unit Kerja"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "unit_kerja",
                value: formData.unit_kerja,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-55436002",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-d136c16f",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-2f3c710f",
                as: "label",
                children: "TMT CPNS"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "date",
                name: "tmt_cpns",
                value: formData.tmt_cpns,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-897c1028",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-550c1f79",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-a7b626ed",
                as: "label",
                children: "TMT PNS"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "date",
                name: "tmt_pns",
                value: formData.tmt_pns,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-06aa858a",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-1486e0f5",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-de8810aa",
                as: "label",
                children: "TMT Pangkat Terakhir"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "date",
                name: "tmt_pangkat_terakhir",
                value: formData.tmt_pangkat_terakhir,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-d559113a",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-aae970db",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-56c5746e",
                as: "label",
                children: "TMT Jabatan"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "date",
                name: "tmt_jabatan",
                value: formData.tmt_jabatan,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-715977ed",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-5ec152d6",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-99cebdab",
                as: "label",
                children: "Role Akses Sistem"
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                name: "role",
                value: formData.role,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-21ce5aae",
                as: "select",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "pegawai",
                  renderId: "render-581ccb7c",
                  as: "option",
                  children: "Pegawai"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "admin",
                  renderId: "render-5a7f22e6",
                  as: "option",
                  children: "Administrator"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "pimpinan",
                  renderId: "render-1e4b5615",
                  as: "option",
                  children: "Pimpinan"
                })]
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "mb-8",
          renderId: "render-2e362823",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-base font-semibold text-[#111827] mb-4 pb-2 border-b border-[#E5E7EB]",
            renderId: "render-e698e46c",
            as: "h3",
            children: "Data Pendidikan"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "grid grid-cols-1 md:grid-cols-2 gap-5",
            renderId: "render-d06e1fb1",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-0d9a5399",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-5437d95b",
                as: "label",
                children: "Pendidikan Terakhir"
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                name: "pendidikan_terakhir",
                value: formData.pendidikan_terakhir,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-e8d97a76",
                as: "select",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "",
                  renderId: "render-3218679b",
                  as: "option",
                  children: "Pilih"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "SMA/SMK",
                  renderId: "render-3c080551",
                  as: "option",
                  children: "SMA/SMK"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "D3",
                  renderId: "render-7c99fe73",
                  as: "option",
                  children: "D3"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "S1",
                  renderId: "render-2a385931",
                  as: "option",
                  children: "S1"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "S2",
                  renderId: "render-47049f06",
                  as: "option",
                  children: "S2"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  value: "S3",
                  renderId: "render-8f7355d0",
                  as: "option",
                  children: "S3"
                })]
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-96ab7e1d",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-84fce761",
                as: "label",
                children: "Jurusan"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "jurusan",
                value: formData.jurusan,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-a135392a",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-58d3744d",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-4cc26043",
                as: "label",
                children: "Nama Institusi"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "text",
                name: "nama_institusi",
                value: formData.nama_institusi,
                onChange: handleChange,
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-e387c261",
                as: "input"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              renderId: "render-87b1f6a7",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "block text-sm font-medium text-[#111827] mb-2",
                renderId: "render-5e8ad634",
                as: "label",
                children: "Tahun Lulus"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                type: "number",
                name: "tahun_lulus",
                value: formData.tahun_lulus,
                onChange: handleChange,
                min: "1950",
                max: "2030",
                className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                renderId: "render-29282bfb",
                as: "input"
              })]
            })]
          })]
        }), error && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600",
          renderId: "render-da9c4053",
          as: "div",
          children: error
        }), success && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-600",
          renderId: "render-95ffb3fc",
          as: "div",
          children: "Data berhasil diupdate! Mengalihkan..."
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex items-center gap-3 pt-6 border-t border-[#E5E7EB]",
          renderId: "render-815b2c85",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            type: "submit",
            disabled: saving || success,
            className: "px-6 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors disabled:opacity-50",
            renderId: "render-d88bb7eb",
            as: "button",
            children: saving ? "Menyimpan..." : "Simpan Perubahan"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: `/pegawai/${params.id}`,
            className: "px-6 py-2.5 border border-[#E5E7EB] text-[#111827] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors",
            renderId: "render-33b552d4",
            as: "a",
            children: "Batal"
          })]
        })]
      })]
    })]
  });
}

const page$3 = UNSAFE_withComponentProps(function WrappedPage(props) {
  const params = useParams();
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(EditPegawaiPage, {
      ...props,
      id: params.id
    })
  });
});

const route16 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$3
}, Symbol.toStringTag, { value: 'Module' }));

const STATUS_CONFIG = {
  draft: {
    label: "Draft",
    className: "bg-[#F3F4F6] text-[#6B7280]",
    icon: Clock
  },
  submitted: {
    label: "Diajukan",
    className: "bg-[#EFF6FF] text-[#2563EB]",
    icon: Clock
  },
  dinilai: {
    label: "Dinilai",
    className: "bg-[#ECFDF5] text-[#059669]",
    icon: CheckCircle2
  },
  revisi: {
    label: "Perlu Revisi",
    className: "bg-[#FEF2F2] text-[#DC2626]",
    icon: AlertCircle
  }
};
const TAHUN_OPTIONS$1 = Array.from({
  length: 5
}, (_, i) => (/* @__PURE__ */ new Date()).getFullYear() - i);
function SKPPage() {
  const {
    data: user,
    loading: userLoading
  } = useUser();
  const [pegawai, setPegawai] = useState(null);
  const [skpList, setSkpList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tahun, setTahun] = useState((/* @__PURE__ */ new Date()).getFullYear());
  const [filterStatus, setFilterStatus] = useState("");
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
      return;
    }
    if (user) fetchProfile();
  }, [user, userLoading]);
  useEffect(() => {
    if (pegawai) fetchSKP();
  }, [pegawai, tahun, filterStatus]);
  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) {
      window.location.href = "/onboarding";
      return;
    }
    if (res.ok) {
      const d = await res.json();
      setPegawai(d.pegawai);
    }
  };
  const fetchSKP = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        tahun
      });
      if (filterStatus) params.append("status", filterStatus);
      const res = await fetch(`/api/skp/list?${params}`);
      if (res.ok) {
        const d = await res.json();
        setSkpList(d.skp || []);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (id) => {
    await fetch(`/api/skp/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "submitted"
      })
    });
    fetchSKP();
  };
  if (userLoading || !pegawai) return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
    className: "flex min-h-screen items-center justify-center bg-[#F9FAFB]",
    renderId: "render-0b2bc870",
    as: "div",
    children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "text-sm text-[#6B7280]",
      renderId: "render-213c78ff",
      as: "div",
      children: "Memuat..."
    })
  });
  const periodeLabels = {
    semester1: "Semester I",
    semester2: "Semester II",
    tahunan: "Tahunan"
  };
  return /* @__PURE__ */ jsxs(AppLayout, {
    pegawai,
    activeHref: "/skp",
    children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "flex items-center justify-between mb-6",
      renderId: "render-7ef1a0c2",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        renderId: "render-33313f68",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-2xl font-semibold text-[#111827] tracking-tight mb-1",
          renderId: "render-f1df9beb",
          as: "h2",
          children: "Sasaran Kinerja Pegawai (SKP)"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#6B7280]",
          renderId: "render-123a8e4c",
          as: "p",
          children: "Upload dan pantau penilaian kinerja Anda"
        })]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        href: "/skp/upload",
        className: "inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors",
        renderId: "render-1009a29f",
        as: "a",
        children: [/* @__PURE__ */ jsx(Upload, {
          size: 16
        }), " Upload SKP"]
      })]
    }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "bg-white rounded-xl border border-[#E5E7EB] p-4 mb-6 flex flex-wrap gap-4 items-center",
      renderId: "render-03bc51b6",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "flex items-center gap-2",
        renderId: "render-aeb1749c",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#6B7280]",
          renderId: "render-07d2ba02",
          as: "label",
          children: "Tahun:"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          value: tahun,
          onChange: (e) => setTahun(e.target.value),
          className: "px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
          renderId: "render-dd100d6b",
          as: "select",
          children: TAHUN_OPTIONS$1.map((t) => /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            value: t,
            renderId: "render-30e987be",
            as: "option",
            children: t
          }, t))
        })]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "flex items-center gap-2",
        renderId: "render-15724292",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#6B7280]",
          renderId: "render-0fa44f12",
          as: "label",
          children: "Status:"
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          value: filterStatus,
          onChange: (e) => setFilterStatus(e.target.value),
          className: "px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
          renderId: "render-98996d99",
          as: "select",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            value: "",
            renderId: "render-dac16f4e",
            as: "option",
            children: "Semua Status"
          }), Object.entries(STATUS_CONFIG).map(([v, c]) => /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            value: v,
            renderId: "render-75246fae",
            as: "option",
            children: c.label
          }, v))]
        })]
      })]
    }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "bg-white rounded-xl border border-[#E5E7EB] overflow-hidden",
      renderId: "render-82cfb7fb",
      as: "div",
      children: loading ? /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "px-4 py-12 text-center text-sm text-[#6B7280]",
        renderId: "render-9d0d79fe",
        as: "div",
        children: "Memuat data SKP..."
      }) : skpList.length === 0 ? /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "px-4 py-16 text-center",
        renderId: "render-5bcfdfde",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4",
          renderId: "render-7b1bccb1",
          as: "div",
          children: /* @__PURE__ */ jsx(FileText, {
            size: 32,
            className: "text-[#9CA3AF]"
          })
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "text-sm font-medium text-[#111827] mb-1",
          renderId: "render-620ec170",
          as: "p",
          children: ["Belum ada data SKP untuk tahun ", tahun]
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-xs text-[#6B7280] mb-4",
          renderId: "render-143c59ef",
          as: "p",
          children: "Upload SKP Anda untuk memulai"
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          href: "/skp/upload",
          className: "inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm rounded-lg hover:bg-[#1D4ED8]",
          renderId: "render-6b05215e",
          as: "a",
          children: [/* @__PURE__ */ jsx(Upload, {
            size: 16
          }), " Upload SKP Sekarang"]
        })]
      }) : /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
        className: "overflow-x-auto",
        renderId: "render-af9d4273",
        as: "div",
        children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "w-full",
          renderId: "render-36638647",
          as: "table",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            renderId: "render-de0c4473",
            as: "thead",
            children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "bg-[#F9FAFB] border-b border-[#E5E7EB]",
              renderId: "render-ce19aa3d",
              as: "tr",
              children: [pegawai.role !== "pegawai" && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                renderId: "render-45836067",
                as: "th",
                children: "Pegawai"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                renderId: "render-e0e1ad6c",
                as: "th",
                children: "Periode"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                renderId: "render-0df7948e",
                as: "th",
                children: "Tahun"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                renderId: "render-56d85ed2",
                as: "th",
                children: "Target"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                renderId: "render-1e4ce0dd",
                as: "th",
                children: "Nilai Akhir"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                renderId: "render-7ed97a85",
                as: "th",
                children: "Status"
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider",
                renderId: "render-fdae1429",
                as: "th",
                children: "Aksi"
              })]
            })
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "divide-y divide-[#E5E7EB]",
            renderId: "render-88661f14",
            as: "tbody",
            children: skpList.map((skp) => {
              const conf = STATUS_CONFIG[skp.status] || STATUS_CONFIG.draft;
              const Icon = conf.icon;
              return /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "hover:bg-[#F9FAFB] transition-colors",
                renderId: "render-c8f3c86f",
                as: "tr",
                children: [pegawai.role !== "pegawai" && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                  className: "px-4 py-3",
                  renderId: "render-68e9be4a",
                  as: "td",
                  children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    className: "text-sm font-medium text-[#111827]",
                    renderId: "render-ccb1d280",
                    as: "p",
                    children: skp.nama_lengkap
                  }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                    className: "text-xs text-[#6B7280] font-mono",
                    renderId: "render-30c1ca56",
                    as: "p",
                    children: skp.nip
                  })]
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#111827]",
                  renderId: "render-5285f20b",
                  as: "td",
                  children: periodeLabels[skp.periode] || skp.periode
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#111827]",
                  renderId: "render-728680c1",
                  as: "td",
                  children: skp.tahun
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm text-[#6B7280]",
                  renderId: "render-f5cc27e0",
                  as: "td",
                  children: skp.target_nilai ?? "-"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3 text-sm font-semibold text-[#111827]",
                  renderId: "render-26264e2d",
                  as: "td",
                  children: skp.nilai_akhir ?? "-"
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3",
                  renderId: "render-d7b1cf39",
                  as: "td",
                  children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                    className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${conf.className}`,
                    renderId: "render-7580bfed",
                    as: "span",
                    children: [/* @__PURE__ */ jsx(Icon, {
                      size: 12
                    }), " ", conf.label]
                  })
                }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "px-4 py-3",
                  renderId: "render-c572246b",
                  as: "td",
                  children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                    className: "flex items-center gap-2",
                    renderId: "render-8047e8d6",
                    as: "div",
                    children: [skp.dokumen_url && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                      href: skp.dokumen_url,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "p-1.5 hover:bg-[#EFF6FF] rounded transition-colors",
                      title: "Lihat Dokumen",
                      renderId: "render-8b2d5058",
                      as: "a",
                      children: /* @__PURE__ */ jsx(Eye, {
                        size: 16,
                        className: "text-[#6B7280]"
                      })
                    }), skp.status === "draft" && pegawai.role === "pegawai" && /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                      onClick: () => handleSubmit(skp.id),
                      className: "px-3 py-1 bg-[#2563EB] text-white text-xs rounded-md hover:bg-[#1D4ED8] transition-colors",
                      renderId: "render-f0f2c753",
                      as: "button",
                      children: "Submit"
                    })]
                  })
                })]
              }, skp.id);
            })
          })]
        })
      })
    })]
  });
}

const page$2 = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(SKPPage, {
      ...props
    })
  });
});

const route17 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$2
}, Symbol.toStringTag, { value: 'Module' }));

const PERIODES = [{
  value: "semester1",
  label: "Semester I (Januari - Juni)"
}, {
  value: "semester2",
  label: "Semester II (Juli - Desember)"
}, {
  value: "tahunan",
  label: "Tahunan"
}];
const TAHUN_OPTIONS = Array.from({
  length: 5
}, (_, i) => (/* @__PURE__ */ new Date()).getFullYear() - i);
function SKPUploadPage() {
  const {
    data: user,
    loading: userLoading
  } = useUser();
  const [upload, {
    loading: uploadLoading
  }] = useUpload();
  const [pegawai, setPegawai] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [form, setForm] = useState({
    tahun: (/* @__PURE__ */ new Date()).getFullYear(),
    periode: "",
    target_nilai: "",
    catatan: ""
  });
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
      return;
    }
    if (user) fetchProfile();
  }, [user, userLoading]);
  const fetchProfile = async () => {
    const res = await fetch("/api/pegawai/profile");
    if (res.status === 404) {
      window.location.href = "/onboarding";
      return;
    }
    if (res.ok) {
      const d = await res.json();
      setPegawai(d.pegawai);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.periode) {
      setError("Pilih periode SKP terlebih dahulu");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      let dokumen_url = null;
      if (file) {
        const result = await upload({
          file
        });
        if (result.error) throw new Error("Gagal mengupload file: " + result.error);
        dokumen_url = result.url;
      }
      const res = await fetch("/api/skp/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          dokumen_url
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan SKP");
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/skp";
      }, 2e3);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };
  if (userLoading || !pegawai) return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
    className: "flex min-h-screen items-center justify-center bg-[#F9FAFB]",
    renderId: "render-62177292",
    as: "div",
    children: /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
      className: "text-sm text-[#6B7280]",
      renderId: "render-1503906b",
      as: "div",
      children: "Memuat..."
    })
  });
  return /* @__PURE__ */ jsx(AppLayout, {
    pegawai,
    activeHref: "/skp",
    children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "max-w-2xl mx-auto",
      renderId: "render-88a0524f",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "flex items-center gap-3 mb-6",
        renderId: "render-e58cfdbd",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          href: "/skp",
          className: "p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors",
          renderId: "render-21f08ebf",
          as: "a",
          children: /* @__PURE__ */ jsx(ArrowLeft, {
            size: 20,
            className: "text-[#6B7280]"
          })
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-92d01b26",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-2xl font-semibold text-[#111827] tracking-tight",
            renderId: "render-a10f3534",
            as: "h2",
            children: "Upload SKP"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "text-sm text-[#6B7280]",
            renderId: "render-75230ea9",
            as: "p",
            children: "Unggah dokumen Sasaran Kinerja Pegawai"
          })]
        })]
      }), success && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "mb-6 p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-3",
        renderId: "render-913d36f7",
        as: "div",
        children: [/* @__PURE__ */ jsx(Check, {
          size: 20,
          className: "text-[#059669]"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#059669] font-medium",
          renderId: "render-90e30ed1",
          as: "p",
          children: "SKP berhasil disimpan! Mengalihkan ke halaman SKP..."
        })]
      }), error && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "mb-6 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-center gap-3",
        renderId: "render-58011166",
        as: "div",
        children: [/* @__PURE__ */ jsx(X, {
          size: 20,
          className: "text-[#DC2626]"
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "text-sm text-[#DC2626]",
          renderId: "render-591933fa",
          as: "p",
          children: error
        })]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        onSubmit: handleSubmit,
        className: "bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-6",
        renderId: "render-ce87ed5b",
        as: "form",
        children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex items-center gap-3 p-3 bg-[#EFF6FF] rounded-lg",
          renderId: "render-7e0e06e9",
          as: "div",
          children: [/* @__PURE__ */ jsx(Info, {
            size: 16,
            className: "text-[#2563EB] flex-shrink-0"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "text-sm",
            renderId: "render-26093350",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "text-[#1D4ED8] font-medium",
              renderId: "render-8c66ca9d",
              as: "span",
              children: pegawai.nama_lengkap
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "text-[#6B7280] mx-2",
              renderId: "render-2b50035c",
              as: "span",
              children: "·"
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "text-[#6B7280]",
              renderId: "render-fab899f6",
              as: "span",
              children: [pegawai.jabatan, " · ", pegawai.unit_kerja]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "grid grid-cols-2 gap-4",
          renderId: "render-2898cfea",
          as: "div",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            renderId: "render-19cfb31d",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "block text-sm font-medium text-[#374151] mb-1.5",
              renderId: "render-715a1fa3",
              as: "label",
              children: ["Tahun ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-[#DC2626]",
                renderId: "render-7cb040a8",
                as: "span",
                children: "*"
              })]
            }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              value: form.tahun,
              onChange: (e) => setForm((f) => ({
                ...f,
                tahun: e.target.value
              })),
              className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
              renderId: "render-e94c26dd",
              as: "select",
              children: TAHUN_OPTIONS.map((t) => /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                value: t,
                renderId: "render-b6e44a52",
                as: "option",
                children: t
              }, t))
            })]
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            renderId: "render-8ab42fc6",
            as: "div",
            children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "block text-sm font-medium text-[#374151] mb-1.5",
              renderId: "render-97724082",
              as: "label",
              children: ["Periode ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-[#DC2626]",
                renderId: "render-f1dfa737",
                as: "span",
                children: "*"
              })]
            }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              value: form.periode,
              onChange: (e) => setForm((f) => ({
                ...f,
                periode: e.target.value
              })),
              className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
              renderId: "render-2134a4ee",
              as: "select",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                value: "",
                renderId: "render-1a4c464d",
                as: "option",
                children: "Pilih Periode..."
              }), PERIODES.map((p) => /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                value: p.value,
                renderId: "render-2a37304a",
                as: "option",
                children: p.label
              }, p.value))]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-38e463b2",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#374151] mb-1.5",
            renderId: "render-70995c5b",
            as: "label",
            children: "Target Nilai (opsional)"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            type: "number",
            min: "0",
            max: "100",
            placeholder: "Contoh: 85",
            value: form.target_nilai,
            onChange: (e) => setForm((f) => ({
              ...f,
              target_nilai: e.target.value
            })),
            className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
            renderId: "render-f74dfaa6",
            as: "input"
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-689e0cf0",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#374151] mb-1.5",
            renderId: "render-54f30a17",
            as: "label",
            children: "Catatan (opsional)"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            rows: 3,
            placeholder: "Catatan tambahan...",
            value: form.catatan,
            onChange: (e) => setForm((f) => ({
              ...f,
              catatan: e.target.value
            })),
            className: "w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] resize-none",
            renderId: "render-b43c8860",
            as: "textarea"
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          renderId: "render-5c08204d",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "block text-sm font-medium text-[#374151] mb-1.5",
            renderId: "render-e60fecfb",
            as: "label",
            children: "Dokumen SKP (PDF/Gambar)"
          }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: `relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragActive ? "border-[#2563EB] bg-[#EFF6FF]" : file ? "border-[#059669] bg-[#ECFDF5]" : "border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#F9FAFB]"}`,
            onDragEnter: () => setDragActive(true),
            onDragLeave: () => setDragActive(false),
            onDragOver: (e) => e.preventDefault(),
            onDrop: handleDrop,
            onClick: () => document.getElementById("skp-file-input").click(),
            renderId: "render-cd73988d",
            as: "div",
            children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              id: "skp-file-input",
              type: "file",
              className: "hidden",
              accept: ".pdf,.jpg,.jpeg,.png",
              onChange: (e) => {
                if (e.target.files?.[0]) setFile(e.target.files[0]);
              },
              renderId: "render-f0b13900",
              as: "input"
            }), file ? /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "flex flex-col items-center gap-2",
              renderId: "render-f5c65bca",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "w-10 h-10 bg-[#ECFDF5] rounded-full flex items-center justify-center",
                renderId: "render-f3d62184",
                as: "div",
                children: /* @__PURE__ */ jsx(Check, {
                  size: 20,
                  className: "text-[#059669]"
                })
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-sm font-medium text-[#059669]",
                renderId: "render-fe350d0f",
                as: "p",
                children: file.name
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "text-xs text-[#6B7280]",
                renderId: "render-ab6849d5",
                as: "p",
                children: [(file.size / 1024 / 1024).toFixed(2), " MB"]
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                type: "button",
                onClick: (e) => {
                  e.stopPropagation();
                  setFile(null);
                },
                className: "text-xs text-[#DC2626] hover:underline flex items-center gap-1",
                renderId: "render-53ff7005",
                as: "button",
                children: [/* @__PURE__ */ jsx(X, {
                  size: 12
                }), " Hapus file"]
              })]
            }) : /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
              className: "flex flex-col items-center gap-2",
              renderId: "render-074b73ae",
              as: "div",
              children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center",
                renderId: "render-7f2134d0",
                as: "div",
                children: /* @__PURE__ */ jsx(Upload, {
                  size: 20,
                  className: "text-[#9CA3AF]"
                })
              }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
                className: "text-sm text-[#6B7280]",
                renderId: "render-71888594",
                as: "p",
                children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                  className: "text-[#2563EB] font-medium",
                  renderId: "render-f7286104",
                  as: "span",
                  children: "Klik untuk upload"
                }), " atau seret file ke sini"]
              }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
                className: "text-xs text-[#9CA3AF]",
                renderId: "render-4d081160",
                as: "p",
                children: "PDF, JPG, PNG — Maks. 5MB"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "flex justify-end gap-3 pt-2",
          renderId: "render-941967d9",
          as: "div",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            href: "/skp",
            className: "px-4 py-2 border border-[#E5E7EB] text-sm text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors",
            renderId: "render-ac9acb31",
            as: "a",
            children: "Batal"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            type: "submit",
            disabled: submitting || uploadLoading,
            className: "inline-flex items-center gap-2 px-6 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
            renderId: "render-af599ac1",
            as: "button",
            children: submitting || uploadLoading ? /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(Loader2, {
                size: 16,
                className: "animate-spin"
              }), " Menyimpan..."]
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(FileText, {
                size: 16
              }), " Simpan SKP"]
            })
          })]
        })]
      })]
    })
  });
}

const page$1 = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(SKPUploadPage, {
      ...props
    })
  });
});

const route18 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page$1
}, Symbol.toStringTag, { value: 'Module' }));

const isDev = process.env.NEXT_PUBLIC_CREATE_ENV === "DEVELOPMENT";
const PROVIDER_LABELS = {
  google: "Google",
  facebook: "Facebook",
  twitter: "Twitter / X",
  apple: "Apple"
};
function SocialDevShimPage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isDev) {
      navigate("/");
    }
  }, [navigate]);
  if (!isDev) {
    return null;
  }
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const provider = params.get("provider") || "google";
  const callbackUrl = params.get("callbackUrl") || "/";
  const label = PROVIDER_LABELS[provider] || provider;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [missingSecrets, setMissingSecrets] = useState(null);
  useEffect(() => {
    fetch(`/api/__create/check-social-secrets?provider=${encodeURIComponent(provider)}`).then((r) => r.json()).then((data) => setMissingSecrets(data.missing || [])).catch((err) => {
      console.error("Failed to check social secrets:", err);
    });
  }, [provider]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn("dev-social", {
        email,
        name,
        provider,
        callbackUrl
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed. Please try again.");
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
    className: "min-h-screen flex items-center justify-center font-sans bg-gray-100",
    renderId: "render-0a1ebb69",
    as: "div",
    children: /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
      className: "bg-white rounded-xl p-8 w-full max-w-[400px] shadow-md",
      renderId: "render-017e4696",
      as: "div",
      children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "bg-amber-50 border border-amber-400 rounded-lg p-3 mb-4 text-[13px] text-amber-800",
        renderId: "render-ebf14d3c",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          renderId: "render-3a9679ed",
          as: "strong",
          children: "Development Mode"
        }), " — This is a simulated", " ", label, " sign-in. In production, users will see the real", " ", label, " OAuth screen."]
      }), error && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "bg-red-50 border border-red-400 rounded-lg p-3 mb-4 text-[13px] text-red-900",
        renderId: "render-17dcbe55",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          renderId: "render-ff1444e7",
          as: "strong",
          children: "Sign-in error"
        }), " — ", error]
      }), missingSecrets && missingSecrets.length > 0 && /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "bg-red-50 border border-red-400 rounded-lg p-3 mb-4 text-[13px] text-red-900",
        renderId: "render-e051db7c",
        as: "div",
        children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          renderId: "render-fe2318c1",
          as: "strong",
          children: "Missing secrets"
        }), " — ", label, " sign-in won't work in production until you add these secrets to your project:", " ", missingSecrets.map((s) => /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          className: "bg-red-200 px-1 rounded text-[12px]",
          renderId: "render-3c51eebe",
          as: "code",
          children: s
        }, s))]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        className: "mt-0 mb-6 text-xl font-semibold",
        renderId: "render-64f7dce7",
        as: "h2",
        children: ["Sign in with ", label]
      }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
        onSubmit: handleSubmit,
        renderId: "render-28083d88",
        as: "form",
        children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "block mb-4",
          renderId: "render-b8112102",
          as: "label",
          children: [/* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            className: "block text-sm font-medium mb-1.5",
            renderId: "render-a9b78df4",
            as: "span",
            children: "Email"
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            type: "email",
            required: true,
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "test@example.com",
            className: "w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm",
            renderId: "render-0e593734",
            as: "input"
          })]
        }), /* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
          className: "block mb-6",
          renderId: "render-3788d370",
          as: "label",
          children: [/* @__PURE__ */ jsxs(CreatePolymorphicComponent, {
            className: "block text-sm font-medium mb-1.5",
            renderId: "render-a42f53ba",
            as: "span",
            children: ["Display Name", " ", /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
              className: "text-gray-400",
              renderId: "render-a0bf72a8",
              as: "span",
              children: "(optional)"
            })]
          }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
            type: "text",
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "Test User",
            className: "w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm",
            renderId: "render-c3a48983",
            as: "input"
          })]
        }), /* @__PURE__ */ jsx(CreatePolymorphicComponent, {
          type: "submit",
          disabled: loading,
          className: "w-full py-2.5 rounded-lg border-none text-white text-sm font-medium bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-default cursor-pointer",
          renderId: "render-557ce9e1",
          as: "button",
          children: loading ? "Signing in..." : `Continue as ${label} user`
        })]
      })]
    })
  });
}

const page = UNSAFE_withComponentProps(function WrappedPage(props) {
  return /* @__PURE__ */jsx(RootLayout, {
    children: /* @__PURE__ */jsx(SocialDevShimPage, {
      ...props
    })
  });
});

const route19 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: page
}, Symbol.toStringTag, { value: 'Module' }));

async function clientLoader({
  params
}) {
  return {
    path: `/${params["*"]}`,
    pages: []
  };
}
const notFound = UNSAFE_withComponentProps(function CreateDefaultNotFoundPage({
  loaderData
}) {
  const [siteMap, setSitemap] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window !== "undefined" && window.parent && window.parent !== window) {
      const handler = event => {
        if (event.data.type === "sandbox:sitemap") {
          window.removeEventListener("message", handler);
          setSitemap(event.data.sitemap);
        }
      };
      window.parent.postMessage({
        type: "sandbox:sitemap"
      }, "*");
      window.addEventListener("message", handler);
      return () => {
        window.removeEventListener("message", handler);
      };
    }
  }, []);
  const missingPath = loaderData.path.replace(/^\//, "");
  const existingRoutes = loaderData.pages.map(page => ({
    path: page.path,
    url: page.url
  }));
  const handleBack = () => {
    navigate("/");
  };
  const handleSearch = value => {
    if (!siteMap) {
      const path = `/${value}`;
      navigate(path);
    } else {
      navigate(value);
    }
  };
  const handleCreatePage = useCallback(() => {
    window.parent.postMessage({
      type: "sandbox:web:create",
      path: missingPath,
      view: "web"
    }, "*");
  }, [missingPath]);
  return /* @__PURE__ */jsxs(CreatePolymorphicComponent, {
    className: "flex sm:w-full w-screen sm:min-w-[850px] flex-col",
    renderId: "render-7d6bf389",
    as: "div",
    children: [/* @__PURE__ */jsxs(CreatePolymorphicComponent, {
      className: "flex w-full items-center gap-2 p-5",
      renderId: "render-15c86226",
      as: "div",
      children: [/* @__PURE__ */jsx(CreatePolymorphicComponent, {
        type: "button",
        onClick: handleBack,
        className: "flex items-center justify-center w-10 h-10 rounded-md",
        renderId: "render-dd428f81",
        as: "button",
        children: /* @__PURE__ */jsxs("svg", {
          width: "18",
          height: "18",
          viewBox: "0 0 18 18",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          "aria-label": "Back",
          role: "img",
          children: [/* @__PURE__ */jsx(CreatePolymorphicComponent, {
            d: "M8.5957 2.65435L2.25005 9L8.5957 15.3457",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            renderId: "render-f2afe58e",
            as: "path"
          }), /* @__PURE__ */jsx(CreatePolymorphicComponent, {
            d: "M2.25007 9L15.75 9",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            renderId: "render-8360644d",
            as: "path"
          })]
        })
      }), /* @__PURE__ */jsxs(CreatePolymorphicComponent, {
        className: "flex flex-row divide-x divide-gray-200 rounded-[8px] h-8 w-[300px] border border-gray-200 bg-gray-50 text-gray-500",
        renderId: "render-31d30442",
        as: "div",
        children: [/* @__PURE__ */jsx(CreatePolymorphicComponent, {
          className: "flex items-center px-[14px] py-[5px]",
          renderId: "render-d2ce9d18",
          as: "div",
          children: /* @__PURE__ */jsx(CreatePolymorphicComponent, {
            renderId: "render-6cb5e3bf",
            as: "span",
            children: "/"
          })
        }), /* @__PURE__ */jsx(CreatePolymorphicComponent, {
          className: "flex items-center min-w-0",
          renderId: "render-3fd4b046",
          as: "div",
          children: /* @__PURE__ */jsx(CreatePolymorphicComponent, {
            className: "border-0 bg-transparent px-3 py-2 focus:outline-none truncate max-w-[300px]",
            style: {
              minWidth: 0
            },
            title: missingPath,
            renderId: "render-7b79ec6c",
            as: "p",
            children: missingPath
          })
        })]
      })]
    }), /* @__PURE__ */jsxs(CreatePolymorphicComponent, {
      className: "flex flex-grow flex-col items-center justify-center pt-[100px] text-center gap-[20px]",
      renderId: "render-6464fd55",
      as: "div",
      children: [/* @__PURE__ */jsx(CreatePolymorphicComponent, {
        className: "text-4xl font-medium text-gray-900 px-2",
        renderId: "render-562c5492",
        as: "h1",
        children: "Uh-oh! This page doesn't exist (yet)."
      }), /* @__PURE__ */jsxs(CreatePolymorphicComponent, {
        className: "pt-4 pb-12 px-2 text-gray-500",
        renderId: "render-2e3620cf",
        as: "p",
        children: ['Looks like "', /* @__PURE__ */jsxs(CreatePolymorphicComponent, {
          className: "font-bold",
          renderId: "render-ba600843",
          as: "span",
          children: ["/", missingPath]
        }), `" isn't part of your project. But no worries, you've got options!`]
      }), /* @__PURE__ */jsx(CreatePolymorphicComponent, {
        className: "px-[20px] w-full",
        renderId: "render-ed61e8ae",
        as: "div",
        children: /* @__PURE__ */jsxs(CreatePolymorphicComponent, {
          className: "flex flex-row justify-center items-center w-full max-w-[800px] mx-auto border border-gray-200 rounded-lg p-[20px] mb-[40px] gap-[20px]",
          renderId: "render-2e493ed9",
          as: "div",
          children: [/* @__PURE__ */jsxs(CreatePolymorphicComponent, {
            className: "flex flex-col gap-[5px] items-start self-start w-1/2",
            renderId: "render-857bfa07",
            as: "div",
            children: [/* @__PURE__ */jsx(CreatePolymorphicComponent, {
              className: "text-sm text-black text-left",
              renderId: "render-1dc2671f",
              as: "p",
              children: "Build it from scratch"
            }), /* @__PURE__ */jsxs(CreatePolymorphicComponent, {
              className: "text-sm text-gray-500 text-left",
              renderId: "render-5785d4d3",
              as: "p",
              children: ['Create a new page to live at "', /* @__PURE__ */jsxs(CreatePolymorphicComponent, {
                renderId: "render-550aa13b",
                as: "span",
                children: ["/", missingPath]
              }), '"']
            })]
          }), /* @__PURE__ */jsx(CreatePolymorphicComponent, {
            className: "flex flex-row items-center justify-end w-1/2",
            renderId: "render-3afd4b84",
            as: "div",
            children: /* @__PURE__ */jsx(CreatePolymorphicComponent, {
              type: "button",
              className: "bg-black text-white px-[10px] py-[5px] rounded-md",
              onClick: () => handleCreatePage(),
              renderId: "render-3b82e0db",
              as: "button",
              children: "Create Page"
            })
          })]
        })
      }), /* @__PURE__ */jsx(CreatePolymorphicComponent, {
        className: "pb-20 lg:pb-[80px]",
        renderId: "render-557d5f7e",
        as: "div",
        children: /* @__PURE__ */jsx(CreatePolymorphicComponent, {
          className: "flex items-center text-gray-500",
          renderId: "render-6a53abc0",
          as: "p",
          children: "Check out all your project's routes here ↓"
        })
      }), siteMap ? /* @__PURE__ */jsx(CreatePolymorphicComponent, {
        className: "flex flex-col justify-center items-center w-full px-[50px]",
        renderId: "render-e44849c2",
        as: "div",
        children: /* @__PURE__ */jsxs(CreatePolymorphicComponent, {
          className: "flex flex-col justify-between items-center w-full max-w-[600px] gap-[10px]",
          renderId: "render-28718e1a",
          as: "div",
          children: [/* @__PURE__ */jsx(CreatePolymorphicComponent, {
            className: "text-sm text-gray-300 pb-[10px] self-start p-4",
            renderId: "render-21332326",
            as: "p",
            children: "PAGES"
          }), siteMap.webPages?.map(route => /* @__PURE__ */jsxs(CreatePolymorphicComponent, {
            type: "button",
            onClick: () => handleSearch(route.cleanRoute || ""),
            className: "flex flex-row justify-between text-center items-center p-4 rounded-lg bg-white shadow-sm w-full hover:bg-gray-50",
            renderId: "render-872bdcdd",
            as: "button",
            children: [/* @__PURE__ */jsx(CreatePolymorphicComponent, {
              className: "font-medium text-gray-900",
              renderId: "render-aba282a5",
              as: "h3",
              children: route.name
            }), /* @__PURE__ */jsx(CreatePolymorphicComponent, {
              className: "text-sm text-gray-400",
              renderId: "render-5dfa774b",
              as: "p",
              children: route.cleanRoute
            })]
          }, route.id))]
        })
      }) : /* @__PURE__ */jsx(CreatePolymorphicComponent, {
        className: "flex flex-wrap gap-3 w-full max-w-[80rem] mx-auto pb-5 px-2",
        renderId: "render-e5a4fca9",
        as: "div",
        children: existingRoutes.map(route => /* @__PURE__ */jsx(CreatePolymorphicComponent, {
          className: "flex flex-col flex-grow basis-full sm:basis-[calc(50%-0.375rem)] xl:basis-[calc(33.333%-0.5rem)]",
          renderId: "render-5d86db81",
          as: "div",
          children: /* @__PURE__ */jsxs(CreatePolymorphicComponent, {
            className: "w-full flex-1 flex flex-col items-center ",
            renderId: "render-066e36ec",
            as: "div",
            children: [/* @__PURE__ */jsx(CreatePolymorphicComponent, {
              className: "relative w-full max-w-[350px] h-48 sm:h-56 lg:h-64 overflow-hidden rounded-[8px] border border-comeback-gray-75 transition-all group-hover:shadow-md",
              renderId: "render-1ba02a4a",
              as: "div",
              children: /* @__PURE__ */jsx(CreatePolymorphicComponent, {
                type: "button",
                onClick: () => handleSearch(route.url.replace(/^\//, "")),
                className: "h-full w-full rounded-[8px] bg-gray-50 bg-cover",
                renderId: "render-7f21a3e2",
                as: "button"
              })
            }), /* @__PURE__ */jsx(CreatePolymorphicComponent, {
              className: "pt-3 text-left text-gray-500 w-full max-w-[350px]",
              renderId: "render-9b7c2180",
              as: "p",
              children: route.path
            })]
          })
        }, route.path))
      })]
    })]
  });
});

const route20 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  clientLoader,
  default: notFound
}, Symbol.toStringTag, { value: 'Module' }));

const serverManifest = {'entry':{'module':'/assets/entry.client-DelIY4jb.js','imports':['/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/index-D1EYpMOH.js'],'css':[]},'routes':{'root':{'id':'root','parentId':undefined,'path':'','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/root-Bw8jZ9JQ.js','imports':['/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/index-D1EYpMOH.js','/assets/PolymorphicComponent-Qms0vkWC.js','/assets/react-B1a6nwHa.js'],'css':['/assets/root-Dbq7gUg8.css'],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'page':{'id':'page','parentId':'root','path':undefined,'index':true,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-vxQgpeuY.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useUser-BRUxmDrF.js','/assets/createLucideIcon-BdE_nI1B.js','/assets/award-BnsIRvKF.js','/assets/bell-C2iLKSmd.js','/assets/users-jsC8l4ZR.js','/assets/calendar-ABwBauen.js','/assets/file-text-CVVr_dZv.js','/assets/circle-alert-BvPEqJbI.js','/assets/react-B1a6nwHa.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'account/logout/page':{'id':'account/logout/page','parentId':'root','path':'account/logout','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-BCmEo0sB.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useAuth-D2SQX-YW.js','/assets/react-B1a6nwHa.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'account/signin/page':{'id':'account/signin/page','parentId':'root','path':'account/signin','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-n_Ft-atz.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useAuth-D2SQX-YW.js','/assets/react-B1a6nwHa.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'account/signup/page':{'id':'account/signup/page','parentId':'root','path':'account/signup','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-CxkyAF-K.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useAuth-D2SQX-YW.js','/assets/react-B1a6nwHa.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'cuti/page':{'id':'cuti/page','parentId':'root','path':'cuti','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page--bu2gfIl.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useUser-BRUxmDrF.js','/assets/AppLayout-nFXGGHnF.js','/assets/plus-CYCv9JnO.js','/assets/circle-alert-BvPEqJbI.js','/assets/createLucideIcon-BdE_nI1B.js','/assets/circle-check-GwhYO0sZ.js','/assets/clock-CiDPEwMG.js','/assets/calendar-ABwBauen.js','/assets/react-B1a6nwHa.js','/assets/bell-C2iLKSmd.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'cuti/ajukan/page':{'id':'cuti/ajukan/page','parentId':'root','path':'cuti/ajukan','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-DM8j3KTA.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useUser-BRUxmDrF.js','/assets/AppLayout-nFXGGHnF.js','/assets/arrow-left-LnpPvbih.js','/assets/x-2h3_JAaX.js','/assets/info-ko60J2vg.js','/assets/calendar-ABwBauen.js','/assets/react-B1a6nwHa.js','/assets/bell-C2iLKSmd.js','/assets/createLucideIcon-BdE_nI1B.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'dossier/page':{'id':'dossier/page','parentId':'root','path':'dossier','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-CErzIyOq.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/layout-CzsmmoSy.js','/assets/useUser-BRUxmDrF.js','/assets/useUpload-f6OzR31g.js','/assets/AppLayout-nFXGGHnF.js','/assets/upload-BUS5lZFE.js','/assets/search-ZfmtIpkX.js','/assets/circle-alert-BvPEqJbI.js','/assets/clock-CiDPEwMG.js','/assets/circle-check-GwhYO0sZ.js','/assets/file-text-CVVr_dZv.js','/assets/eye-Bv4yDxdf.js','/assets/createLucideIcon-BdE_nI1B.js','/assets/react-B1a6nwHa.js','/assets/bell-C2iLKSmd.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'dossier/upload/page':{'id':'dossier/upload/page','parentId':'root','path':'dossier/upload','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-D3xfs6zd.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/layout-CzsmmoSy.js','/assets/useUser-BRUxmDrF.js','/assets/useUpload-f6OzR31g.js','/assets/AppLayout-nFXGGHnF.js','/assets/arrow-left-LnpPvbih.js','/assets/x-2h3_JAaX.js','/assets/upload-BUS5lZFE.js','/assets/file-text-CVVr_dZv.js','/assets/createLucideIcon-BdE_nI1B.js','/assets/react-B1a6nwHa.js','/assets/bell-C2iLKSmd.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'kenaikan-pangkat/page':{'id':'kenaikan-pangkat/page','parentId':'root','path':'kenaikan-pangkat','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-BhH0qGJd.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useUser-BRUxmDrF.js','/assets/AppLayout-nFXGGHnF.js','/assets/plus-CYCv9JnO.js','/assets/award-BnsIRvKF.js','/assets/circle-check-GwhYO0sZ.js','/assets/react-B1a6nwHa.js','/assets/bell-C2iLKSmd.js','/assets/createLucideIcon-BdE_nI1B.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'kenaikan-pangkat/usulan/page':{'id':'kenaikan-pangkat/usulan/page','parentId':'root','path':'kenaikan-pangkat/usulan','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-DbkcvAQ5.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useUser-BRUxmDrF.js','/assets/AppLayout-nFXGGHnF.js','/assets/arrow-left-LnpPvbih.js','/assets/x-2h3_JAaX.js','/assets/info-ko60J2vg.js','/assets/react-B1a6nwHa.js','/assets/bell-C2iLKSmd.js','/assets/createLucideIcon-BdE_nI1B.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'kgb/page':{'id':'kgb/page','parentId':'root','path':'kgb','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-Dm3tTpms.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useUser-BRUxmDrF.js','/assets/AppLayout-nFXGGHnF.js','/assets/bell-C2iLKSmd.js','/assets/calendar-ABwBauen.js','/assets/createLucideIcon-BdE_nI1B.js','/assets/react-B1a6nwHa.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'onboarding/page':{'id':'onboarding/page','parentId':'root','path':'onboarding','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-DSWD-Aa2.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useUser-BRUxmDrF.js','/assets/react-B1a6nwHa.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'pegawai/page':{'id':'pegawai/page','parentId':'root','path':'pegawai','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-BRJDiCFH.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useUser-BRUxmDrF.js','/assets/plus-CYCv9JnO.js','/assets/search-ZfmtIpkX.js','/assets/createLucideIcon-BdE_nI1B.js','/assets/users-jsC8l4ZR.js','/assets/eye-Bv4yDxdf.js','/assets/square-pen-CK2eua7l.js','/assets/react-B1a6nwHa.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'pegawai/tambah/page':{'id':'pegawai/tambah/page','parentId':'root','path':'pegawai/tambah','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-DzRHLpXb.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useUser-BRUxmDrF.js','/assets/arrow-left-LnpPvbih.js','/assets/react-B1a6nwHa.js','/assets/createLucideIcon-BdE_nI1B.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'pegawai/[id]/page':{'id':'pegawai/[id]/page','parentId':'root','path':'pegawai/:id','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-DLjWib7K.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useUser-BRUxmDrF.js','/assets/arrow-left-LnpPvbih.js','/assets/square-pen-CK2eua7l.js','/assets/createLucideIcon-BdE_nI1B.js','/assets/file-text-CVVr_dZv.js','/assets/calendar-ABwBauen.js','/assets/react-B1a6nwHa.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'pegawai/[id]/edit/page':{'id':'pegawai/[id]/edit/page','parentId':'root','path':'pegawai/:id/edit','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-DoadXxJb.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useUser-BRUxmDrF.js','/assets/arrow-left-LnpPvbih.js','/assets/react-B1a6nwHa.js','/assets/createLucideIcon-BdE_nI1B.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'skp/page':{'id':'skp/page','parentId':'root','path':'skp','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-CWTaE83p.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useUser-BRUxmDrF.js','/assets/AppLayout-nFXGGHnF.js','/assets/upload-BUS5lZFE.js','/assets/circle-alert-BvPEqJbI.js','/assets/circle-check-GwhYO0sZ.js','/assets/clock-CiDPEwMG.js','/assets/file-text-CVVr_dZv.js','/assets/eye-Bv4yDxdf.js','/assets/react-B1a6nwHa.js','/assets/bell-C2iLKSmd.js','/assets/createLucideIcon-BdE_nI1B.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'skp/upload/page':{'id':'skp/upload/page','parentId':'root','path':'skp/upload','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-DNEMHNBu.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/useUser-BRUxmDrF.js','/assets/useUpload-f6OzR31g.js','/assets/AppLayout-nFXGGHnF.js','/assets/arrow-left-LnpPvbih.js','/assets/x-2h3_JAaX.js','/assets/info-ko60J2vg.js','/assets/upload-BUS5lZFE.js','/assets/file-text-CVVr_dZv.js','/assets/react-B1a6nwHa.js','/assets/bell-C2iLKSmd.js','/assets/createLucideIcon-BdE_nI1B.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'__create/social-dev-shim/page':{'id':'__create/social-dev-shim/page','parentId':'root','path':'__create/social-dev-shim','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/page-Dp9uikeJ.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js','/assets/layout-C9Of-nKa.js','/assets/react-B1a6nwHa.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined},'__create/not-found':{'id':'__create/not-found','parentId':'root','path':'*?','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':true,'hasClientMiddleware':false,'hasDefaultExport':true,'hasErrorBoundary':false,'module':'/assets/not-found-DGvYp91r.js','imports':['/assets/PolymorphicComponent-Qms0vkWC.js','/assets/chunk-EVOBXE3Y-CHOZNQPk.js'],'css':[],'clientActionModule':undefined,'clientLoaderModule':undefined,'clientMiddlewareModule':undefined,'hydrateFallbackModule':undefined}},'url':'/assets/manifest-66f5ee3e.js','version':'66f5ee3e','sri':undefined};

const assetsBuildDirectory = "build\\client";
      const basename = "/";
      const future = {"unstable_optimizeDeps":false,"unstable_passThroughRequests":false,"unstable_subResourceIntegrity":false,"unstable_trailingSlashAwareDataRequests":false,"unstable_previewServerPrerendering":false,"v8_middleware":false,"v8_splitRouteModules":false,"v8_viteEnvironmentApi":false};
      const ssr = true;
      const isSpaMode = false;
      const prerender = [];
      const routeDiscovery = {"mode":"lazy","manifestPath":"/__manifest"};
      const publicPath = "/";
      const entry = { module: entryServer };
      const routes = {
        "root": {
          id: "root",
          parentId: undefined,
          path: "",
          index: undefined,
          caseSensitive: undefined,
          module: route0
        },
  "page": {
          id: "page",
          parentId: "root",
          path: undefined,
          index: true,
          caseSensitive: undefined,
          module: route1
        },
  "account/logout/page": {
          id: "account/logout/page",
          parentId: "root",
          path: "account/logout",
          index: undefined,
          caseSensitive: undefined,
          module: route2
        },
  "account/signin/page": {
          id: "account/signin/page",
          parentId: "root",
          path: "account/signin",
          index: undefined,
          caseSensitive: undefined,
          module: route3
        },
  "account/signup/page": {
          id: "account/signup/page",
          parentId: "root",
          path: "account/signup",
          index: undefined,
          caseSensitive: undefined,
          module: route4
        },
  "cuti/page": {
          id: "cuti/page",
          parentId: "root",
          path: "cuti",
          index: undefined,
          caseSensitive: undefined,
          module: route5
        },
  "cuti/ajukan/page": {
          id: "cuti/ajukan/page",
          parentId: "root",
          path: "cuti/ajukan",
          index: undefined,
          caseSensitive: undefined,
          module: route6
        },
  "dossier/page": {
          id: "dossier/page",
          parentId: "root",
          path: "dossier",
          index: undefined,
          caseSensitive: undefined,
          module: route7
        },
  "dossier/upload/page": {
          id: "dossier/upload/page",
          parentId: "root",
          path: "dossier/upload",
          index: undefined,
          caseSensitive: undefined,
          module: route8
        },
  "kenaikan-pangkat/page": {
          id: "kenaikan-pangkat/page",
          parentId: "root",
          path: "kenaikan-pangkat",
          index: undefined,
          caseSensitive: undefined,
          module: route9
        },
  "kenaikan-pangkat/usulan/page": {
          id: "kenaikan-pangkat/usulan/page",
          parentId: "root",
          path: "kenaikan-pangkat/usulan",
          index: undefined,
          caseSensitive: undefined,
          module: route10
        },
  "kgb/page": {
          id: "kgb/page",
          parentId: "root",
          path: "kgb",
          index: undefined,
          caseSensitive: undefined,
          module: route11
        },
  "onboarding/page": {
          id: "onboarding/page",
          parentId: "root",
          path: "onboarding",
          index: undefined,
          caseSensitive: undefined,
          module: route12
        },
  "pegawai/page": {
          id: "pegawai/page",
          parentId: "root",
          path: "pegawai",
          index: undefined,
          caseSensitive: undefined,
          module: route13
        },
  "pegawai/tambah/page": {
          id: "pegawai/tambah/page",
          parentId: "root",
          path: "pegawai/tambah",
          index: undefined,
          caseSensitive: undefined,
          module: route14
        },
  "pegawai/[id]/page": {
          id: "pegawai/[id]/page",
          parentId: "root",
          path: "pegawai/:id",
          index: undefined,
          caseSensitive: undefined,
          module: route15
        },
  "pegawai/[id]/edit/page": {
          id: "pegawai/[id]/edit/page",
          parentId: "root",
          path: "pegawai/:id/edit",
          index: undefined,
          caseSensitive: undefined,
          module: route16
        },
  "skp/page": {
          id: "skp/page",
          parentId: "root",
          path: "skp",
          index: undefined,
          caseSensitive: undefined,
          module: route17
        },
  "skp/upload/page": {
          id: "skp/upload/page",
          parentId: "root",
          path: "skp/upload",
          index: undefined,
          caseSensitive: undefined,
          module: route18
        },
  "__create/social-dev-shim/page": {
          id: "__create/social-dev-shim/page",
          parentId: "root",
          path: "__create/social-dev-shim",
          index: undefined,
          caseSensitive: undefined,
          module: route19
        },
  "__create/not-found": {
          id: "__create/not-found",
          parentId: "root",
          path: "*?",
          index: undefined,
          caseSensitive: undefined,
          module: route20
        }
      };
      
      const allowedActionOrigins = false;

export { allowedActionOrigins, serverManifest as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
