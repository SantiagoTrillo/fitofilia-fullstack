import { Injectable } from "@nestjs/common"
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse, UploadStream } from "cloudinary"
import { parse } from "node:path"

cloudinary.config({ cloud_name: "vdhnniui", api_key: "137244742448984", api_secret: "Wl7ta9Pei3K562VeH7DRwC0pjm8" })

@Injectable()
export class ArchivosService {
  async subirArchivo(archivo: Express.Multer.File, carpeta: string): Promise<string> {
    return new Promise<string>(
      (resolver: Function, rechazar: Function): void => {
        const stream: UploadStream = cloudinary.uploader.upload_stream(
          {
            folder: carpeta,
            public_id: parse(archivo.originalname).name,
            resource_type: "image",
          },
          (error: UploadApiErrorResponse | undefined, resultado: UploadApiResponse | undefined): void => {
            if (error) rechazar (new Error("No se pudo subir la foto a Cloudinary"))
            else if (!resultado?.secure_url) rechazar(new Error("Cloudinary no devolvió la URL de la imagen"))
            else resolver(resultado.secure_url)
          },
        )
        stream.on("Error", (error: Error): void => { rechazar(new Error("No se pudo enviar la foto a Cloudinary")) })
        stream.end(archivo.buffer)
      }
    )
  }
}