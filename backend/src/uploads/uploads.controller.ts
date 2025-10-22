import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomBytes } from 'crypto';
import { existsSync, mkdirSync } from 'fs';

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

const dest = join(process.cwd(), 'src', 'uploads', 'products'); // TEMP if you insist on src/
ensureDir(dest);

@Controller('admin/uploads')
export class UploadsController {
  @Post('images')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, dest),
        filename: (_req, file, cb) => {
          const id = randomBytes(6).toString('hex');
          cb(null, `${Date.now()}-${id}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const ok = /image\/(png|jpe?g|webp|avif)/i.test(file.mimetype);
        cb(ok ? null : new Error('Invalid image type'), ok);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    // Return relative URLs that the frontend will resolve against VITE_API_URL
    const paths = (files ?? []).map((f) => `uploads/products/${f.filename}`);
    return { ok: true, data: { files: paths } };
  }
}
