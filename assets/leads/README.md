# Lead-magnet assets

Drop the actual downloadable PDFs in this directory. The site references them
by path; until a file exists at the referenced path, the download link will
return a 404 (the email is still captured by Web3Forms in the meantime).

## Currently referenced

- `cloud-security-quickstart.pdf` — referenced by the `#resources` section in
  `index.html` via `data-pdf="/assets/leads/cloud-security-quickstart.pdf"`.

## How to add a new lead magnet

1. Drop the PDF here with a kebab-case filename.
2. Update the `data-pdf` attribute on the relevant `.lead-magnet-form` in
   `index.html` to point at it.
3. (Optional) Update the `subject` hidden input so submissions are tagged
   per-magnet in your inbox.
