import {BadRequestException, Injectable, InternalServerErrorException} from "@nestjs/common"
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse, UploadStream } from "cloudinary"
import { parse } from "node:path"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class ArchivosService {
  constructor(configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.getOrThrow<string>("NOMBRE_NUBE_CLOUDINARY"),
      api_key: configService.getOrThrow<string>("LLAVE_API_CLOUDINARY"),
      api_secret: configService.getOrThrow<string>("SECRETO_API_CLOUDINARY"),
    })
  }

  async subirArchivo(archivo: Express.Multer.File, carpeta: string): Promise<string> {
    if (!archivo?.buffer?.length) throw new BadRequestException("El archivo está vacío o no contiene datos")

    return new Promise<string>(
      (resolver: Function, rechazar: Function): void => {
        const stream: UploadStream = cloudinary.uploader.upload_stream(
          {
            folder: carpeta,
            public_id: parse(archivo.originalname).name,
            resource_type: "image",
          },
          (error: UploadApiErrorResponse | undefined, resultado: UploadApiResponse | undefined): void => {
            if (error) {
              rechazar (new InternalServerErrorException("No se pudo subir la foto a Cloudinary", { cause: error }))
            }
            else if (!resultado?.secure_url) {
              rechazar(new InternalServerErrorException("Cloudinary no devolvió la URL de la imagen"))
            }
            else resolver(resultado.secure_url)
          },
        )
        stream.on("error", (error: Error): void => {
          rechazar(new InternalServerErrorException("No se pudo enviar la foto a Cloudinary", { cause: error }))
        })
        stream.end(archivo.buffer)
      }
    )
  }
}