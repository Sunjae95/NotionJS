const ROUTE_CHANGE_EVENT_NAME = "route-change";
export const initRouter = (onRoute) => {
  window.addEventListener(ROUTE_CHANGE_EVENT_NAME, (e) => {
    const { nextUrl } = e.detail;

    if (nextUrl === "/") {
      history.replaceState(null, null, nextUrl);
      onRoute(nextUrl);
    } else if (nextUrl) {
      history.pushState(null, null, nextUrl);
      onRoute(nextUrl);
    }
  });
};

export const push = (nextUrl) => {
  window.dispatchEvent(
    new CustomEvent("route-change", {
      detail: { nextUrl },
    })
  );
};
