const { body } = require('express-validator');
const { validateImageUrl } = require('../utils/urlValidator');

/**
 * Valida um campo de URL de imagem.
 * @param {string} fieldName - Nome do campo.
 * @param {boolean} optional - Se o campo é opcional.
 */
const validateImageUrlField = (fieldName, optional = false) => {
  return body(fieldName).custom((value) => {
    if (optional && !value) return true;

    if (!value) {
      throw new Error(`${fieldName} é obrigatório`);
    }

    const validation = validateImageUrl(value);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    return true;
  });
};

/**
 * Validação de URLs para campos de Media.
 * Campos que esperam uma URL externa (image, bannerImage, thumbnail)
 */
const validateMediaUrls = [
  validateImageUrlField('image'),           // obrigatória
  validateImageUrlField('bannerImage', true), // opcional
  validateImageUrlField('thumbnail', true)    // opcional
];

/**
 * Validação de uploads de usuário.
 * Esses campos serão enviados como arquivos pelo usuário,
 * então não precisam ser validados como URLs.
 */
const validateUserUploads = [
  body('avatar').optional(),      // arquivo enviado via upload
  body('coverImage').optional()   // arquivo enviado via upload
];

module.exports = {
  validateMediaUrls,
  validateUserUploads,
  validateImageUrlField
};
