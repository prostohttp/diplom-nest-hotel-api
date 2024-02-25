import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle("Дипломный проект на курсе «Backend-разработка на Node.js»")
    .setDescription(
      "Дипломный проект представляет собой сайт-агрегатор просмотра и бронирования гостиниц. Ваша задача заключается в разработке бэкенда для сайта-агрегатора с реализацией возможности бронирования гостиниц на диапазон дат.",
    )
    .setVersion("1.0")
    .build();
};
