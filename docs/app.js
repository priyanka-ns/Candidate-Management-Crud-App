// Candidate Management — client-side demo (localStorage). No backend required.
(function () {
  "use strict";

  const KEY = "candidates_demo_v1";
  const PAGE_SIZE = 5;

  const SEED = [
    { id: 1, candidateFirstName: "Aarav", candidateLastName: "Sharma", candidateEmail: "aarav.sharma@example.com", phoneNo: "9876543210", location: "Mumbai", education: "B.E. Computer", experience: 3.5, source: "employeeReferral", status: "round2" },
    { id: 2, candidateFirstName: "Neha", candidateLastName: "Verma", candidateEmail: "neha.verma@example.com", phoneNo: "9812345678", location: "Pune", education: "MCA", experience: 2.0, source: "naukri", status: "applied" },
    { id: 3, candidateFirstName: "Rohan", candidateLastName: "Iyer", candidateEmail: "rohan.iyer@example.com", phoneNo: "9900112233", location: "Bengaluru", education: "B.Sc IT", experience: 5.0, source: "careerSite", status: "hired" },
    { id: 4, candidateFirstName: "Sara", candidateLastName: "Khan", candidateEmail: "sara.khan@example.com", phoneNo: "9765432109", location: "Delhi", education: "B.Tech IT", experience: 1.5, source: "socialNetwork", status: "offered" },
    { id: 5, candidateFirstName: "Vikram", candidateLastName: "Rao", candidateEmail: "vikram.rao@example.com", phoneNo: "9654321098", location: "Hyderabad", education: "MCA", experience: 4.0, source: "agency", status: "round1" },
    { id: 6, candidateFirstName: "Priya", candidateLastName: "Nair", candidateEmail: "priya.nair@example.com", phoneNo: "9543210987", location: "Chennai", education: "B.E. IT", experience: 2.5, source: "direct", status: "rejected" }
  ];

  const SOURCE_LABELS = { agency: "Agency", careerSite: "Career Site", direct: "Direct", employeeReferral: "Employee Referral", naukri: "Naukri", sms: "SMS", socialNetwork: "Social Network" };
  const STATUS_LABELS = { applied: "Applied", suggested: "Suggested", round1: "Round 1", round2: "Round 2", round3: "Round 3", offered: "Offered", hired: "Hired", rejected: "Rejected" };
  const STATUS_CLASS = { applied: "secondary", suggested: "info", round1: "warning", round2: "warning", round3: "warning", offered: "primary", hired: "success", rejected: "danger" };
  const IN_PROCESS = ["applied", "suggested", "round1", "round2", "round3", "offered"];

  let state = { search: "", sortField: "id", sortDir: "asc", page: 1 };

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    save(SEED);
    return SEED.slice();
  }
  function save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

  let data = load();

  function nextId() { return data.reduce((m, c) => Math.max(m, c.id), 0) + 1; }

  function toast(msg, cls) {
    const t = $("toast");
    t.className = "toast align-items-center border-0 text-bg-" + (cls || "success");
    $("toastMsg").textContent = msg;
    bootstrap.Toast.getOrCreateInstance(t, { delay: 2200 }).show();
  }

  function filtered() {
    const q = state.search.trim().toLowerCase();
    let rows = data.filter((c) => !q ||
      (c.candidateFirstName + " " + c.candidateLastName + " " + c.candidateEmail + " " + c.location).toLowerCase().includes(q));
    const f = state.sortField, dir = state.sortDir === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      let x = a[f], y = b[f];
      if (f === "candidateFirstName") { x = a.candidateFirstName + a.candidateLastName; y = b.candidateFirstName + b.candidateLastName; }
      if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
      return String(x).localeCompare(String(y), undefined, { numeric: true }) * dir;
    });
    return rows;
  }

  function render() {
    // stats
    $("statTotal").textContent = data.length;
    $("statHired").textContent = data.filter((c) => c.status === "hired").length;
    $("statProcess").textContent = data.filter((c) => IN_PROCESS.includes(c.status)).length;
    $("statRejected").textContent = data.filter((c) => c.status === "rejected").length;

    const rows = filtered();
    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * PAGE_SIZE;
    const pageRows = rows.slice(start, start + PAGE_SIZE);

    const tbody = $("tbody");
    if (pageRows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" class="text-center py-5 empty"><i class="bi bi-inbox fs-3 d-block mb-2"></i>No candidates found.</td></tr>';
    } else {
      tbody.innerHTML = pageRows.map((c) => `
        <tr>
          <th scope="row">${c.id}</th>
          <td>${esc(c.candidateFirstName)} ${esc(c.candidateLastName)}</td>
          <td>${esc(c.candidateEmail)}</td>
          <td>${esc(c.phoneNo)}</td>
          <td>${esc(c.location)}</td>
          <td>${esc(c.education)}</td>
          <td>${esc(c.experience)}</td>
          <td><span class="badge text-bg-light badge-soft">${esc(SOURCE_LABELS[c.source] || c.source)}</span></td>
          <td><span class="badge badge-soft text-bg-${STATUS_CLASS[c.status] || "secondary"}">${esc(STATUS_LABELS[c.status] || c.status)}</span></td>
          <td class="text-end text-nowrap">
            <button class="btn btn-sm btn-outline-primary" data-edit="${c.id}"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-outline-danger" data-del="${c.id}"><i class="bi bi-trash"></i></button>
          </td>
        </tr>`).join("");
    }

    // count + sort indicators
    $("countLabel").textContent = `Showing ${rows.length ? start + 1 : 0}-${Math.min(start + PAGE_SIZE, rows.length)} of ${rows.length}`;
    document.querySelectorAll("th[data-sort] .bi").forEach((i) => (i.className = "bi"));
    const th = document.querySelector(`th[data-sort="${state.sortField}"] .bi`);
    if (th) th.className = "bi bi-caret-" + (state.sortDir === "asc" ? "up-fill" : "down-fill");

    // pager
    const pager = $("pager");
    let html = `<li class="page-item ${state.page === 1 ? "disabled" : ""}"><a class="page-link" href="#" data-page="${state.page - 1}">Prev</a></li>`;
    for (let p = 1; p <= totalPages; p++) html += `<li class="page-item ${p === state.page ? "active" : ""}"><a class="page-link" href="#" data-page="${p}">${p}</a></li>`;
    html += `<li class="page-item ${state.page === totalPages ? "disabled" : ""}"><a class="page-link" href="#" data-page="${state.page + 1}">Next</a></li>`;
    pager.innerHTML = html;
  }

  // form modal
  const modalEl = $("formModal");
  const modal = new bootstrap.Modal(modalEl);
  const form = $("candidateForm");

  function openAdd() {
    form.reset(); form.classList.remove("was-validated");
    $("fld-id").value = ""; $("modalTitle").textContent = "Add Candidate";
    $("fld-experience").value = "0";
    modal.show();
  }
  function openEdit(id) {
    const c = data.find((x) => x.id === id); if (!c) return;
    form.classList.remove("was-validated");
    $("fld-id").value = c.id; $("modalTitle").textContent = "Edit Candidate";
    $("fld-firstName").value = c.candidateFirstName; $("fld-lastName").value = c.candidateLastName;
    $("fld-email").value = c.candidateEmail; $("fld-phone").value = c.phoneNo;
    $("fld-location").value = c.location; $("fld-education").value = c.education;
    $("fld-experience").value = c.experience; $("fld-source").value = c.source; $("fld-status").value = c.status;
    modal.show();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.classList.add("was-validated"); return; }
    const idVal = $("fld-id").value;
    const rec = {
      candidateFirstName: $("fld-firstName").value.trim(),
      candidateLastName: $("fld-lastName").value.trim(),
      candidateEmail: $("fld-email").value.trim(),
      phoneNo: $("fld-phone").value.trim(),
      location: $("fld-location").value.trim(),
      education: $("fld-education").value.trim(),
      experience: parseFloat($("fld-experience").value) || 0,
      source: $("fld-source").value,
      status: $("fld-status").value
    };
    if (idVal) {
      const i = data.findIndex((x) => x.id === Number(idVal));
      data[i] = Object.assign({ id: Number(idVal) }, rec);
      toast("Candidate updated successfully.");
    } else {
      rec.id = nextId(); data.push(rec); state.page = Math.ceil(data.length / PAGE_SIZE);
      toast("Candidate added successfully.");
    }
    save(data); modal.hide(); render();
  });

  // events
  $("btnAdd").addEventListener("click", openAdd);
  $("btnReset").addEventListener("click", function () {
    if (confirm("Reset the demo data back to the sample candidates?")) {
      data = SEED.slice(); save(data); state.page = 1; render(); toast("Demo data reset.", "secondary");
    }
  });
  $("search").addEventListener("input", function (e) { state.search = e.target.value; state.page = 1; render(); });

  document.querySelector("thead").addEventListener("click", function (e) {
    const th = e.target.closest("th[data-sort]"); if (!th) return;
    const f = th.getAttribute("data-sort");
    if (state.sortField === f) state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
    else { state.sortField = f; state.sortDir = "asc"; }
    render();
  });

  $("tbody").addEventListener("click", function (e) {
    const ed = e.target.closest("[data-edit]"); const del = e.target.closest("[data-del]");
    if (ed) openEdit(Number(ed.getAttribute("data-edit")));
    else if (del) {
      const id = Number(del.getAttribute("data-del"));
      const c = data.find((x) => x.id === id);
      if (c && confirm(`Delete ${c.candidateFirstName} ${c.candidateLastName}?`)) {
        data = data.filter((x) => x.id !== id); save(data); render(); toast("Candidate deleted.", "danger");
      }
    }
  });

  $("pager").addEventListener("click", function (e) {
    const a = e.target.closest("a[data-page]"); if (!a) return;
    e.preventDefault();
    const p = Number(a.getAttribute("data-page"));
    const totalPages = Math.max(1, Math.ceil(filtered().length / PAGE_SIZE));
    if (p >= 1 && p <= totalPages) { state.page = p; render(); }
  });

  render();
})();
