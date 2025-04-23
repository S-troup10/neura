const selectMethod_ = document.getElementById("input-method");
  const sections = {
    saved: document.getElementById("saved-section"),
    upload: document.getElementById("upload-section"),
    manual: document.getElementById("manual-section"),
  };

  const allRecipients = [];
  const listTitle = document.getElementById("list-title");
  const listDescription = document.getElementById("list-description");

  methodSelect.addEventListener("change", function () {
    const selected = this.value;
    for (const [key, section] of Object.entries(sections)) {
      section.classList.toggle("hidden", key !== selected);
    }
  });

  function updateRecipientPreview() {
    const tableBody = document.getElementById("list-preview-body");
    tableBody.innerHTML = "";

    if (allRecipients.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-gray-400">No recipients added.</td></tr>`;
      return;
    }

    allRecipients.forEach(({ name, email, company }) => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-700";
      tr.innerHTML = `
        <td class="py-2 px-3">${name || "-"}</td>
        <td class="py-2 px-3">${email}</td>
        <td class="py-2 px-3">${company || "-"}</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Manual Entry
  function addManualRecipient() {
    const name = document.getElementById("manual-name").value;
    const email = document.getElementById("manual-email").value;
    const company = document.getElementById("manual-company").value;

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }

    allRecipients.push({ name, email, company });
    updateRecipientPreview();

    // Clear fields
    document.getElementById("manual-name").value = "";
    document.getElementById("manual-email").value = "";
    document.getElementById("manual-company").value = "";
  }

  // CSV Upload
  document.getElementById("csv-upload").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById("csv-file-name").innerText = "Uploaded: " + file.name;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const validRows = results.data.filter(row => row.email && row.email.includes("@"));
        validRows.forEach(row => {
          allRecipients.push({
            name: row.name || "-",
            email: row.email,
            company: row.company || "-"
          });
        });
        updateRecipientPreview();
      }
    });
  });

  // Mock Saved List
  function handleSavedList(listName) {
    if (listName === "sample") {
      allRecipients.push(
        { name: "Alice Smith", email: "alice@example.com", company: "Alpha Co." },
        { name: "Bob Johnson", email: "bob@example.com", company: "Beta Ltd." }
      );
      updateRecipientPreview();
    }
  }

  // Save List
  function saveList() {
    const title = listTitle.value;
    const description = listDescription.value;

    if (!title) {
      alert("Please provide a list title.");
      return;
    }

    const listData = {
      title,
      description,
      recipients: allRecipients,
    };

    console.log("List saved:", listData);
    alert("List has been saved successfully!");
    // You can send `listData` to the server or store it locally
  }