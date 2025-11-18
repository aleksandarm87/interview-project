# Solution Documentation

## 1. Identified Issue

In production mode (`npm run build` → `npm run start`), Next.js does not dynamically serve files added to the `public/` directory after the build process.  
While the image uploads worked in development (`npm run dev`), the production static file server uses a **build-time snapshot** of the `public` folder.

Because of this, the uploaded images:

- were correctly saved to disk,
- but could not be accessed via `/uploads/<imagename>` in production,
- causing the image preview to fail,
- both in local production and in Docker.

This behavior is expected due to how Next.js handles static assets in production.

---

## 2. Changes Implemented to Fix It

### Added a dynamic API route for serving uploaded images

A new api was created: app/api/images/[file]/route.ts

This api:

- read file directly from the uploads directory at runtime,
- returns binary responses with correct MIME types,
- completely bypasses the static `public` serving limitations,
- works in development, production, and Docker.

### Kept uploads stored on disk but no longer served them via `/public/uploads`

The upload location remains, but images are now accessed only through the API route.

### Updated the frontend to use the new API endpoint

Uploaded images are now displayed using: /api/images/<imagename>

This ensures previews work consistently across all environments.

---

## 3. Additional Recommended Improvements

### Add upload validation
Examples:
- allowed MIME types
- max file size
- allowed extensions

### Upload Progress Indicator  
Provide real-time feedback during uploads using:

- `XMLHttpRequest` with `onprogress`
- or `axios` with `onUploadProgress`

This improves UX by showing users the exact status of the upload process.

### Image Cropping Tool  
Allow users to crop or adjust their images before uploading. 
Useful for profile pictures, banners, or any UI where aspect ratio matters.


### Client-Side Image Compression  
Compressing images before upload can reduce file sizes dramatically.

- faster uploads,
- reduced server storage usage,
- improved performance in environments with slow upload speeds

---

## 4. Commands Used to Test the Solution

### Development
```bash
npm run dev
```

### Local production
```bash
npm run build
npm start
```

### Docker run
```bash
docker-compose up
```

### Testing checklist
1. Start the app (dev, local prod, docker).
2. Upload an image.
3. Verify:
   - image is saved successfully,
   - preview works using `/api/images/<imagename>`,
   - the uploaded file exists on disk.
4. Repeat across all environments.

---

