export async function downloadReport(analysis) {
  if (!analysis) return;
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const pageH = doc.internal.pageSize.getHeight();
  let y = margin;

  const write = (text, size = 11, bold = false, gap = 6) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.splitTextToSize(String(text), width).forEach((line) => {
      if (y > pageH - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += size + 4;
    });
    y += gap;
  };

  const list = (title, items) => {
    if (!items || !items.length) return;
    write(title, 14, true, 4);
    items.forEach((s) => write("- " + s, 11, false, 2));
    y += 10;
  };

  write("Skill Match - Analysis Report", 20, true, 12);
  write(
    `Skills matched: ${analysis.matchedCount} of ${analysis.totalSkills}`,
    13,
    true,
    14
  );

  list("Must-have gaps", (analysis.mustHave || []).map((g) => g.skill));
  list("Nice-to-have gaps", (analysis.niceToHave || []).map((g) => g.skill));
  list("Skills you already cover", analysis.covered);

  const roles = analysis.careerMatches || [];
  if (roles.length) {
    write("Roles you can target", 14, true, 6);
    roles.forEach((r) => {
      write(`${r.role} - ${r.fit}% fit`, 12, true, 2);
      if (r.why) write(r.why, 10, false, 2);

      const first = (r.skillsToAdd || [])
        .filter((s) => s.priority === "must_have")
        .map((s) => s.skill);
      const nice = (r.skillsToAdd || [])
        .filter((s) => s.priority !== "must_have")
        .map((s) => s.skill);

      if (first.length) write("Add these first: " + first.join(", "), 10, false, 2);
      if (nice.length) write("Nice to add: " + nice.join(", "), 10, false, 2);
      y += 8;
    });
  }

  doc.save("skill-match-report.pdf");
}
