import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const CAPTURE_WIDTH_PX = 900;
const CAPTURE_HEIGHT_PX = Math.round(CAPTURE_WIDTH_PX / 1.4);

function resolveCertificateNode(element) {
  if (!element) return null;
  if (element.classList?.contains("cert-document")) return element;
  return element.querySelector(".cert-document");
}

function prepareCloneForCapture(source) {
  const clone = source.cloneNode(true);
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = [
    "position:fixed",
    "left:0",
    "top:0",
    "width:900px",
    "height:643px",
    "margin:0",
    "padding:0",
    "z-index:2147483646",
    "pointer-events:none",
    "opacity:1",
    "visibility:visible",
    "overflow:hidden",
    "background:#ffffff",
  ].join(";");

  clone.style.transform = "none";
  clone.style.width = `${CAPTURE_WIDTH_PX}px`;
  clone.style.maxWidth = `${CAPTURE_WIDTH_PX}px`;
  clone.style.height = `${CAPTURE_HEIGHT_PX}px`;
  clone.style.minHeight = `${CAPTURE_HEIGHT_PX}px`;
  clone.style.margin = "0";
  clone.style.background = "#ffffff";
  clone.style.color = "#0b1020";
  clone.style.boxShadow = "none";
  clone.style.visibility = "visible";
  clone.style.opacity = "1";
  clone.style.position = "relative";

  const gradientRecipient = clone.querySelector("h3[style]");
  if (gradientRecipient) {
    gradientRecipient.style.backgroundImage = "none";
    gradientRecipient.style.webkitBackgroundClip = "initial";
    gradientRecipient.style.backgroundClip = "initial";
    gradientRecipient.style.webkitTextFillColor = "#0b1020";
    gradientRecipient.style.color = "#0b1020";
  }

  host.appendChild(clone);
  document.body.appendChild(host);

  return { host, clone };
}

function fitImageOnPage(pdf, canvas) {
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 8;
  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2;
  const aspect = canvas.width / canvas.height;

  let imgW = maxW;
  let imgH = imgW / aspect;

  if (imgH > maxH) {
    imgH = maxH;
    imgW = imgH * aspect;
  }

  const x = (pageW - imgW) / 2;
  const y = (pageH - imgH) / 2;
  const imgData = canvas.toDataURL("image/png", 1.0);

  pdf.addImage(imgData, "PNG", x, y, imgW, imgH, undefined, "FAST");
}

function savePdfFile(pdf, filename) {
  const safeName = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  pdf.save(safeName);
}

function saveTextPdfFallback(certEl, filename) {
  const safeName = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  const id = certEl.getAttribute("data-certificate-id") || "certificate";
  const recipient =
    certEl.querySelector("h3")?.textContent?.trim() || "Student";
  const title =
    certEl.querySelector("h4")?.textContent?.trim() || "Course";
  const description =
    certEl.querySelector("h4 + p")?.textContent?.trim() || "";

  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const centerX = pdf.internal.pageSize.getWidth() / 2;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("Cloud Nexus Academy", centerX, 35, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text("Certificate of Completion", centerX, 48, { align: "center" });

  pdf.setFontSize(18);
  pdf.text(recipient, centerX, 68, { align: "center" });

  pdf.setFontSize(12);
  pdf.text("has successfully completed", centerX, 82, { align: "center" });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text(title, centerX, 96, { align: "center" });

  if (description) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    const lines = pdf.splitTextToSize(description, 220);
    pdf.text(lines, centerX, 108, { align: "center" });
  }

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Certificate ID: ${id}`, centerX, 175, { align: "center" });

  savePdfFile(pdf, safeName);
}

export async function downloadCertificatePdf(element, filename) {
  const source = resolveCertificateNode(element);
  if (!source) {
    throw new Error("Certificate element not found");
  }

  const { host, clone } = prepareCloneForCapture(source);

  try {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    let canvas;
    try {
      canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: CAPTURE_WIDTH_PX,
        height: CAPTURE_HEIGHT_PX,
        windowWidth: CAPTURE_WIDTH_PX,
        windowHeight: CAPTURE_HEIGHT_PX,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: false,
      });
    } catch (canvasError) {
      console.warn("Certificate canvas capture failed, using text PDF.", canvasError);
      saveTextPdfFallback(source, filename);
      return;
    }

    if (!canvas.width || !canvas.height) {
      saveTextPdfFallback(source, filename);
      return;
    }

    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    fitImageOnPage(pdf, canvas);
    savePdfFile(pdf, filename);
  } finally {
    host.remove();
  }
}
