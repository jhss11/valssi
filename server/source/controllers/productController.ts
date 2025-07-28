import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";
export class ProductController {
  prisma = new PrismaClient();
  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener tods los productos ordenadas por la fecha  de forma descendente
      const products = await this.prisma.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          price: true,
          averageRating: true,
          images: {
            select: { url: true },
            take: 1,
            orderBy: { id: "asc" },
          },
        },
      });

      response.json(products);
    } catch (error) {
      next(error);
    }
  };

  //Obtener por Id
  getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      let idProduct = parseInt(request.params.id);
      const product = await this.prisma.product.findUnique({
        where: { id: idProduct },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          stock: true,
          averageRating: true,
          category: {
            select: {
              name: true,
              id: true,
            },
          },
          tags: {
            select: {
              name: true,
              id: true,
            },
          },
          images: {
            select: {
              url: true,
            },
          },
          reviews: {
            orderBy: {
          date: "desc",
        },
            select: {
              rating: true,
              description: true,
              date: true,
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });

      response.json(product);
    } catch (error: any) {
      next(error);
    }
  };

  getWithPromotion = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const now = new Date();
      const products = await this.prisma.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          price: true,
          averageRating: true,
          images: {
            select: { url: true },
            take: 1,
            orderBy: { id: "asc" },
          },
          promotions: {
            where: {
              startDate: { lte: now },
              endDate: { gte: now },
            },
          },
          category: {
            include: {
              promotions: {
                where: {
                  startDate: { lte: now },
                  endDate: { gte: now },
                },
              },
            },
          },
        },
        
      });
      response.json(products);
    } catch (error) {
      next(error);
    }
  };

  getProducts = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Iniciando consulta de productos resumidos");
      const products = await this.prisma.product.findMany({
        select: {
          id: true,
          name: true,
        },
      });
      console.log("Consulta exitosa", products.length);
      response.json(products);
    } catch (error) {
      console.error("Error en getProducts:", error);
      next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener los datos json
      const body = request.body;

      const nuevoProducto = await this.prisma.product.create({
        data: {
          name: body.name,
          description: body.description,
          price: body.price,
          stock: body.stock,
          // categoryId:body.categoryId,
          //JSON generos:[{id:valor},{id:valor}]
          category: {
            connect: { id: body.categoryId },
          },
          tags: {
            connect: body.tags, // debe ser un array tipo [{id: 1}, {id: 3}]
          },
          images: {
            create: body.images.map((img: any) => ({
              url: img.url,
            })),
          },
        },
        include: {
          tags: true,
          images: true,
        },
      });
      response.status(201).json(nuevoProducto);
    } catch (error) {
      next(error);
    }
  };

 update = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const body = request.body;
    const idProducto = parseInt(request.params.id);

    // Buscar el producto existente
    const productoExistente = await this.prisma.product.findUnique({
      where: { id: idProducto },
      include: {
        tags: { select: { id: true } },
        images: { select: { url: true } },
      },
    });

    // Preparar tags
    const disconnectTags = productoExistente?.tags.map(tag => ({ id: tag.id }));
    const connectTags = body.tags
      ? body.tags.map((tag: { id: number }) => ({ id: tag.id }))
      : [];

    //Eliminar imágenes indicadas
    if (body.eliminar && Array.isArray(body.eliminar)) {
      await this.prisma.image.deleteMany({
        where: {
          url: { in: body.eliminar },
          productId: idProducto,
        },
      });
    }

    // Obtener urls del producto después de eliminación
    const imagenesRestantes = await this.prisma.image.findMany({
      where: { productId: idProducto },
    });

    const urlsActuales = imagenesRestantes.map(img => img.url);

    //Ver qué imágenes nuevas hay (que no estén aún en la base)
    const createImages = body.images
      ? body.images
          .filter(
            (img: any) =>
              !urlsActuales.includes(img.url) && // no duplicar
              !body.eliminar?.includes(img.url) // no agregar eliminadas
          )
          .map((img: any) => ({ url: img.url }))
      : [];

    // Actualizar producto
    const productoActualizado = await this.prisma.product.update({
      where: { id: idProducto },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        stock: body.stock,
        category: { connect: { id: body.categoryId } },
        tags: { disconnect: disconnectTags, connect: connectTags },
        images: { create: createImages },
      },
    });

    response.json(productoActualizado);
  } catch (error) {
    next(error);
  }
};


}
