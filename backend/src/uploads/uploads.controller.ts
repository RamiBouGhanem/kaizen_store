import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomBytes } from 'crypto';
import { existsSync, mkdirSync } from 'fs';

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

const dest = join(process.cwd(), 'uploads', 'products'); // <= outside src/
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
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    // return "uploads/<file>" so final URL is: `${VITE_API_URL}/uploads/<file>`
    const paths = (files ?? []).map((f) => `uploads/${f.filename}`);
    return { ok: true, data: { files: paths } };
  }
}
