import { PrismaClient, PromoType } from "../generated/prisma";
import { categories } from "./seeds/categories";
import { users } from "./seeds/users";
import { tags } from "./seeds/tags";
import { options } from "./seeds/customOptions";
import { customOptionValues } from "./seeds/customOptionValues";

const prisma = new PrismaClient();
const main = async () => {
  try {
    //Categories - no tiene relaciones
    await prisma.category.createMany({
      data: categories,
      skipDuplicates: true,
    });

    //Usuarios - no tiene relaciones
    await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });

    //Etiquetas - no tiene relaciones
    await prisma.tag.createMany({
      data: tags,
      skipDuplicates: true,
    });

    //Etiquetas - no tiene relaciones
    await prisma.customOption.createMany({
      data: options,
      skipDuplicates: true,
    });

    //Etiquetas - no tiene relaciones
    await prisma.customOptionValue.createMany({
      data: customOptionValues,
      skipDuplicates: true,
    });

    // Instancias de productos Sala (categoríaId = 1)
    //1
    await prisma.product.create({
      data: {
        name: "Sofá reclinable",
        description:
          "Cómodo sofá reclinable, color beige, eléctrico. Con cojines incorporados en espaldar y asiento.",
        price: 89000,
        stock: 10,
        averageRating: 4,
        category: { connect: { id: 1 } },
        images: {
          create: [
            { url: "sofa-reclinable-1.jpg" },
            { url: "sofa-reclinable-2.jpg" },
            { url: "sofa-reclinable-3.jpg" },
          ],
        },
        tags: { connect: [{ id: 1 }, { id: 5 }] },
      },
    });

    //2
    await prisma.product.create({
      data: {
        name: "Set de mesas",
        description:
          "Conjunto de mesas auxiliares de vidrio, redondas y hermosas para decorar.",
        price: 31000,
        stock: 15,
        averageRating: 5,
        category: { connect: { id: 1 } },
        images: {
          create: [{ url: "set-mesas-1.jpg" }, { url: "set-mesas-2.jpg" }],
        },
        tags: { connect: [{ id: 1 }, { id: 5 }] },
      },
    });

    //3
    await prisma.product.create({
      data: {
        name: "Soporte para TV",
        description:
          'Mueble soporte para TV de 59" con estantes, de madera, color blanco.',
        price: 98000,
        stock: 8,
        averageRating: 4,
        category: { connect: { id: 1 } },
        images: {
          create: [{ url: "soporte-tv-1.jpg" }, { url: "soporte-tv-2.jpg" }],
        },
        tags: { connect: [{ id: 1 }, { id: 5 }] },
      },
    });

    // 3. Instancias de productos Habitación (categoríaId = 2)
    //4
    await prisma.product.create({
      data: {
        name: "Edredón personalizable",
        description:
          "Edredón personalizable, puedes escoger el color, diseño y tamaño entre nuestras opciones.",
        price: 22000,
        stock: 20,
        category: { connect: { id: 2 } },
        images: {
          create: [
            { url: "edredon-1.jpg" },
            { url: "edredon-2.jpg" },
            { url: "edredon-3.jpg" },
            { url: "edredon-4.jpg" },
          ],
        },
        tags: { connect: [{ id: 1 }, { id: 2 }] },
      },
    });

    //5
    await prisma.product.create({
      data: {
        name: "Cama tamaño king",
        description:
          "Cama king, con mesitas de noche. Estilo moderno y elegante. Cálido tono café oscuro combina fácilmente con estilos que van desde lo casual hasta lo urbano contemporáneo.",
        price: 280000,
        stock: 5,
        category: { connect: { id: 2 } },
        images: {
          create: [{ url: "cama-king-1.jpg" }, { url: "cama-king-2.jpg" }],
        },
        tags: { connect: [{ id: 1 }, { id: 2 }] },
      },
    });

    // 4. Instancias de productos Comedor (categoríaId = 3)
    //6
    await prisma.product.create({
      data: {
        name: "Banco alto ajustable",
        description:
          "Banco de bar ajustable en altura. Giro de 360 grados. Asiento acolchado con tapizado en imitación de cuero. Descansa pies y base de pedestal pesado",
        price: 27000,
        stock: 12,
        category: { connect: { id: 3 } },
        images: {
          create: [
            { url: "banco-ajustable-1.jpg" },
            { url: "banco-ajustable-2.jpg" },
          ],
        },
        tags: { connect: [{ id: 1 }, { id: 3 }] },
      },
    });

    //7
    await prisma.product.create({
      data: {
        name: "Mesa comedor con 6 sillas",
        description:
          "Mesa de comedor con 6 sillas, juego de comedor de madera suiza.",
        price: 99000,
        stock: 4,
        category: { connect: { id: 3 } },
        images: {
          create: [
            { url: "mesa-comedor-1.jpg" },
            { url: "mesa-comedor-2.jpg" },
            { url: "mesa-comedor-3.jpg" },
          ],
        },
        tags: { connect: [{ id: 1 }, { id: 3 }] },
      },
    });

    // 5. Instancias de productos Accesorios (categoríaId = 4)
    //8
    await prisma.product.create({
      data: {
        name: "Maceta set de 2",
        description:
          "Conjunto de 2 macetas de cerámica con bases de madera. Macetas blancas tamaño medio, madera lisa barnizada.",
        price: 19000,
        stock: 25,
        category: { connect: { id: 4 } },
        images: {
          create: [{ url: "maceta-1.jpg" }, { url: "maceta-2.jpg" }],
        },
        tags: { connect: [{ id: 4 }, { id: 5 }] },
      },
    });

    //9
    await prisma.product.create({
      data: {
        name: "Reloj de pared",
        description:
          "Reloj minimalista de pared. Acabado en metal plateado envejecido. Números Romanos. Soporte de ojo de cerradura para colgar",
        price: 12000,
        stock: 30,
        averageRating: 1,
        category: { connect: { id: 4 } },
        images: {
          create: [
            { url: "reloj-pared-1.jpg" },
            { url: "reloj-pared-2.jpg" },
            { url: "reloj-pared-3.jpg" },
          ],
        },
        tags: { connect: [{ id: 2 }, { id: 3 }] },
      },
    });

    //10
    await prisma.product.create({
      data: {
        name: "Lámpara de piso",
        description:
          "Lámpara de pie con luz regulable. Hecho de metal en tono plateado y mármol blanco con pantallas de vidrio escarchado. bombillos tipo B (no se incluye); 40 vatios máximo; Listado bajo norma UL",
        price: 16700,
        stock: 10,
        category: { connect: { id: 4 } },
        images: {
          create: [{ url: "lampara-1.jpg" }, { url: "lampara-2.jpg" }],
        },
        tags: { connect: [{ id: 2 }, { id: 3 }] },
      },
    });

    //Reseñas
    await prisma.review.create({
      data: {
        userId: 3,
        productId: 1,
        rating: 5,
        description: "Excelente calidad y muy cómodo.",
        date: new Date("2025-01-10"),
      },
    });
    await prisma.review.create({
      data: {
        userId: 4,
        productId: 2,
        rating: 5,
        description: "Muy funcional y fácil de ajustar. Lo recomiendo.",
        date: new Date("2025-02-15"),
      },
    });
    await prisma.review.create({
      data: {
        userId: 5,
        productId: 1,
        rating: 3,
        description:
          "No es lo que esperaba, los colores son diferentes a la imagen.",
        date: new Date("2025-03-05"),
      },
    });
    await prisma.review.create({
      data: {
        userId: 4,
        productId: 9,
        rating: 1,
        description: "Se rompió fácilmente el soporte para pegarlo a la pared.",
        date: new Date("2025-04-01"),
      },
    });
    await prisma.review.create({
      data: {
        userId: 5,
        productId: 3,
        rating: 4,
        description: "Buen soporte pero algo caro.",
        date: new Date("2025-05-20"),
      },
    });

    //Promociones
    await prisma.promotion.create({
      data: {
        name: "Liquidación",
        type: PromoType.PERCENTAGE,
        amount: 15,
        categoryId: 1,
        startDate: new Date("2025-06-01"),
        endDate: new Date("2025-06-30"),
      },
    });
    await prisma.promotion.create({
      data: {
        name: "Descuento set de macetas",
        type: PromoType.FIXED,
        amount: 2900,
        productId: 5,
        startDate: new Date("2025-06-10"),
        endDate: new Date("2025-07-10"),
      },
    });
    await prisma.promotion.create({
      data: {
        name: "Rebaja lámpara",
        type: PromoType.PERCENTAGE,
        amount: 10,
        productId: 10,
        startDate: new Date("2025-06-10"),
        endDate: new Date("2025-07-10"),
      },
    });

    // Orden 1 - Usuario 3
    const order1 = await prisma.order.create({
      data: {
        userId: 3,
        address: "Alajuela centro, la corte",
        paymentMethod: "Efectivo",
        subtotal: 11100,
        total: 11500,
        items: {
          create: [
            { productId: 1, quantity: 2 },
            { productId: 4, quantity: 1 },
          ],
        },
      },
    });
    await prisma.orderStatusLog.create({
      data: { orderId: order1.id, status: "DELIVERED", adminId: 1 },
    });

    // Orden 2 - Usuario 4
    const order2 = await prisma.order.create({
      data: {
        userId: 4,
        address: "San José, Avenida Central",
        paymentMethod: "Tarjeta",
        subtotal: 12000,
        total: 14900,
        items: {
          create: [{ productId: 9, quantity: 1 }],
        },
      },
    });
    await prisma.orderStatusLog.create({
      data: { orderId: order2.id, status: "PAID", adminId: 2 },
    });

    // Orden 3 - Usuario 5
    const order3 = await prisma.order.create({
      data: {
        userId: 5,
        address: "San Ramón, Alajuela",
        paymentMethod: "Efectivo",
        subtotal: 37800,
        total: 38000,
        items: {
          create: [
            { productId: 3, quantity: 1 },
            { productId: 5, quantity: 1 },
          ],
        },
      },
    });
    await prisma.orderStatusLog.create({
      data: { orderId: order3.id, status: "IN_PREPARATION", adminId: 2 },
    });

    const baseProduct = await prisma.product.findFirst({
      where: { name: "Edredón personalizable" },
    });

    if (baseProduct) {
      // Primero buscamos los valores de las opciones
      const color = await prisma.customOptionValue.findFirst({
        where: { value: "Lila" },
      });
      const size = await prisma.customOptionValue.findFirst({
        where: { value: "52cm x 125cm" },
      });
      const design = await prisma.customOptionValue.findFirst({
        where: { value: "Cuadrados cosidos" },
      });

      if (color && size && design) {
        // Luego creamos el customProduct con el precio total calculado
        const customProduct = await prisma.customProduct.create({
          data: {
            baseProductId: baseProduct.id,
            totalPrice:
              baseProduct.price + color.price + size.price + design.price,
          },
        });

        // Crea las selecciones
        await prisma.customProductSelection.createMany({
          data: [
            { customProductId: customProduct.id, optionValueId: color.id },
            { customProductId: customProduct.id, optionValueId: size.id },
            { customProductId: customProduct.id, optionValueId: design.id },
          ],
        });

        await prisma.orderItem.create({
          data: {
            orderId: order3.id, // Id de la orden ya creada
            customProductId: customProduct.id, // Id del producto personalizado creado
            quantity: 1, // Cantidad que quieras agregar
          },
        });
      }
    }
  } catch (error) {
    throw error;
  }
};
main().catch((err) => {
  console.warn("Error al ejecutar el seeder:\n", err);
});
