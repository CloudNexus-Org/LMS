function getScrollRatio() {
  const scrollTop = window.scrollY;
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
  const maxScroll = Math.max(0, scrollHeight - window.innerHeight);
  if (maxScroll <= 0) return 0;
  return Math.min(1, Math.max(0, scrollTop / maxScroll));
}

export { getScrollRatio };
