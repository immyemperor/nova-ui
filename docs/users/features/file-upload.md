# File upload

`<ui-file-upload>` is a dropzone with a file list. It validates files before anything is uploaded and reports every problem at once.

```html
<ui-file-upload label="Attachments" accept=".pdf,.png,.jpg" max-size="5242880" max-files="4"></ui-file-upload>
```

## Validation

- `accept`: allowed extensions or MIME types, for example `image/*,.pdf`.
- `max-size`: largest single file, in bytes.
- `max-files`: how many files may be selected in total.
- `max-total-size`: all files together, in bytes.

Rejected files are listed with the reason, for example "`report.exe` isn't an allowed file type."

## Uploading

Pass an upload function. Each file uploads as it's added, with progress:

```js
upload.uploadFn = (file, onProgress) =>
  uploadToStorage(file, { onProgress: (p) => onProgress(p) }); // resolves with the URL
```

- Events: `ui-files` (accepted files), `ui-uploaded` (`{ file, url }`), `ui-rejected` (problems), `ui-remove`.
- Without `uploadFn`, you receive files through `ui-files` and handle them yourself.
- `name` submits the uploaded URLs with the form.

## Clear

```js
await upload.clear();
```

## Rich text editor uploads

The editor has its own upload path (paste, drop and insert). See [Rich text editor](editor.md).
