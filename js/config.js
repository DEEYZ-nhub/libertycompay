/**
 * Archivo de configuración centralizada para Liberty Company
 * Actualiza aquí los datos principales del sitio
 */

const CONFIG = {
  // Contacto y Teléfono
  phoneNumber: '593985831655',
  whatsappLink: 'https://wa.me/593985831655',
  
  // Métodos de Pago
  paymentData: {
    Paypal: {
      label: 'Email de PayPal',
      address: 'libertycompanyceo@gmail.com'
    },
    Binance: {
      label: 'Binance Pay / Wallet',
      address: '' // TODO: Completar con dirección Binance real si usas este método de pago
    },
    Litecoin: {
      label: 'Dirección Litecoin (LTC)',
      address: 'LXBFtaoVamWS7sT45ZXaXa8sbd1Z377sMe'
    },
    Bitcoin: {
      label: 'Dirección Bitcoin (BTC)',
      address: 'bc1qga7khzpdact9f7zgyx0h4sw3tcyzaqkzjnskuu'
    },
    Upwork: {
      label: 'Upwork (perfil)',
      address: ''
    },
    Fiverr: {
      label: 'Fiverr (gigs)',
      address: ''
    },
    Nequi: {
      label: 'Número Nequi',
      address: '+57 300 7910398'
    },
    Yape: {
      label: 'Yape',
      address: ''
    },
    Cashapp: {
      label: 'CashApp',
      address: ''
    },
    BancoGuayaquil: {
      label: 'Banco Guayaquil (Cuenta)',
      address: 'Cuenta: 8032292 | Titular: Jessenia Villacis | Cédula: 0917627291'
    }
  },

  // Enlaces de Redes Sociales
  socialLinks: {
    instagram: 'https://www.instagram.com/libertycompanyce/',
    telegram: '@lbcompany2025',
    discord: 'https://discord.gg/He7gVabDkV',
    whatsapp: 'https://wa.me/593985831655',
    sellauth: 'https://libertycomp.mysellauth.com/',
    email: 'mailto:libertycompanyceo@gmail.com',
    youtube: 'https://youtube.com/@libertycompany-x4p?si=IiQAmKTRALkmiujz',
    facebook: '',
    tiktok: '',
    linkedin: ''
  },

  // Enlaces de Videos (ordenados para la Tienda / Reseñas)
  storeVideos: [
    {
      title: 'Reseñas',
      url: 'https://youtu.be/Ap17dXNJTw8?si=lvcSBLHM5AqYktq4'
    },
    {
      title: 'Video 2',
      url: '' // COMPLETAR CON URL
    },
    {
      title: 'Video 3',
      url: '' // COMPLETAR CON URL
    },
    {
      title: 'Video 4',
      url: '' // COMPLETAR CON URL
    }
  ],

  // Enlaces Externos
  externalLinks: {
    store: 'https://libertycomp.mysellauth.com/',
    jobForm: 'https://forms.gle/kZkY215WXzBVeUm57'
  },

  // Información de la Empresa
  company: {
    name: 'Liberty Company',
    tagline: 'Tu aliado en crecimiento digital',
    year: new Date().getFullYear()
  },

  // Monedas por defecto
  defaultCurrency: 'EUR',
  defaultLanguage: 'es',

  // PRODUCTOS - DISEÑO WEB (4 PACKS)
  webDesignPacks: [
    {
      id: 'web-normal',
      name: 'Página Web Normal',
      price: 150,
      currency: 'USD',
      guarantee: '1 mes',
      features: [
        '5 páginas estáticas',
        'Diseño responsive',
        'Formulario de contacto',
        'Integración redes sociales',
        'Dominio .com (1 año)'
      ],
      description: 'Página web perfecta para pequeños negocios y portafolios'
    },
    {
      id: 'web-hard',
      name: 'Página Web Hard',
      price: 300,
      currency: 'USD',
      guarantee: '1 mes',
      features: [
        '10 páginas personalizadas',
        'Diseño premium responsive',
        'Blog integrado',
        'Sistema de contacto avanzado',
        'SEO optimizado',
        'Dominio + hosting (1 año)'
      ],
      description: 'Web profesional con funcionalidades avanzadas'
    },
    {
      id: 'web-business',
      name: 'Página Web Business',
      price: 500,
      currency: 'USD',
      guarantee: '1 mes',
      features: [
        '15+ páginas ilimitadas',
        'Dashboard administrativo',
        'Sistema de usuarios',
        'SEO avanzado',
        'Analytics integrado',
        'Soporte 24/7 (1 mes)',
        'Dominio + hosting premium (1 año)'
      ],
      description: 'Solución empresarial completa con gestión interna'
    },
    {
      id: 'web-ecommerce',
      name: 'Página Web Ecommerce',
      price: 800,
      currency: 'USD',
      guarantee: '1 mes',
      features: [
        'Tienda online completa',
        'Sistema de pagos integrado',
        'Gestión de inventario',
        'Carrito de compras avanzado',
        'Múltiples métodos de pago',
        'Reportería de ventas',
        'Soporte 24/7 (3 meses)',
        'Dominio + hosting pro (1 año)'
      ],
      description: 'Ecommerce profesional listo para vender'
    }
  ],

  // PRODUCTOS - DISEÑO GRÁFICO (5 PACKS)
  graphicDesignPacks: [
    {
      id: 'logo-normal',
      name: 'Logo Normal',
      price: 25,
      currency: 'USD',
      guarantee: '1 mes',
      features: [
        '3 propuestas de diseño',
        'Archivos vectoriales (AI, SVG)',
        '2 revisiones incluidas',
        'Versión color y blanco/negro',
        'Manual de uso básico'
      ],
      description: 'Logo profesional para tu marca'
    },
    {
      id: 'banner',
      name: 'Banner',
      price: 35,
      currency: 'USD',
      guarantee: '1 mes',
      features: [
        'Banner para web y redes',
        'Dimensiones personalizadas',
        'Diseño original',
        '2 revisiones',
        'Archivos en múltiples formatos'
      ],
      description: 'Banner publicitario personalizado'
    },
    {
      id: 'dibujo-personalizado',
      name: 'Dibujo Personalizado',
      price: 50,
      currency: 'USD',
      guarantee: '1 mes',
      features: [
        'Ilustración original única',
        'Estilo a elegir',
        '3 revisiones',
        'Alta resolución',
        'Derechos de uso'
      ],
      description: 'Ilustración digital personalizada para ti'
    },
    {
      id: 'diseno-grafico-personalizado',
      name: 'Diseño Gráfico Personalizado',
      price: 75,
      currency: 'USD',
      guarantee: '1 mes',
      features: [
        'Diseño gráfico completo',
        'Concepto personalizado',
        'Múltiples elementos visuales',
        '4 revisiones',
        'Archivos finales editables'
      ],
      description: 'Diseño gráfico profesional para cualquier proyecto'
    },
    {
      id: 'anuncios-promocionales',
      name: 'Anuncios Promocionales',
      price: 100,
      currency: 'USD',
      guarantee: '1 mes',
      features: [
        'Pack de 5 anuncios',
        'Diseño para múltiples plataformas',
        'Adaptado a redes sociales',
        '3 revisiones por diseño',
        'Archivos listos para publicar'
      ],
      description: 'Pack de anuncios para redes sociales y web'
    }
  ],

  // PRODUCTOS - BOT IA PERSONALIZADO (3 PACKS)
  aiChatbotPacks: [
    {
      id: 'bot-normal',
      name: 'Bot IA Normal',
      price: 170,
      currency: 'USD',
      guarantee: '1 mes',
      agents: 1,
      support: '8x5 (Lunes-Viernes)',
      channels: ['Webchat', 'Facebook Messenger', 'Instagram', 'WhatsApp Business API Certificado'],
      features: [
        '1 agente IA',
        '1 Supervisor',
        'Soporte 8x5',
        'Webchat integrado',
        'Facebook Messenger',
        'Instagram',
        'WhatsApp Business API Certificado',
        'Reportería online básica'
      ],
      description: 'Bot IA inicial para pequeños negocios'
    },
    {
      id: 'bot-premium',
      name: 'Bot IA Premium',
      price: 320,
      currency: 'USD',
      guarantee: '1 mes',
      agents: 3,
      support: '24x7',
      channels: ['Webchat', 'Facebook Messenger', 'Instagram', 'WhatsApp Business API Certificado'],
      features: [
        '3 agentes IA',
        '1 Supervisor',
        'Soporte 24x7',
        'Webchat integrado',
        'Facebook Messenger',
        'Instagram',
        'WhatsApp Business API Certificado',
        'Reportería online en tiempo real'
      ],
      description: 'Bot IA profesional con cobertura completa'
    },
    {
      id: 'bot-ultimate',
      name: 'Bot IA Ultimate',
      price: 410,
      currency: 'USD',
      guarantee: '1 mes',
      agents: 5,
      support: '24x7',
      channels: ['Webchat', 'Facebook Messenger', 'Instagram', 'WhatsApp Business API Certificado'],
      features: [
        '5 agentes IA',
        '1 Supervisor dedicado',
        'Soporte 24x7 prioritario',
        'Webchat avanzado',
        'Facebook Messenger',
        'Instagram',
        'WhatsApp Business API Certificado',
        'Reportería online en tiempo real incluida',
        'Integración con CRM',
        'Análisis de comportamiento'
      ],
      description: 'Bot IA enterprise con máximo rendimiento'
    }
  ],

  // PRODUCTOS - DIGITAL GOODS (2/4 DE LA TIENDA)
  digitalGoods: [
    /* Robux removed per site cleanup */
    {
      id: 'discord-nitro',
      name: 'Discord Nitro',
      price: 'Variable',
      guarantee: 'Entrega inmediata',
      description: 'Suscripción Discord Nitro'
    },
    {
      id: 'vbucks',
      name: 'V-Bucks',
      price: 'Variable',
      guarantee: 'Entrega inmediata',
      description: 'Moneda virtual de Fortnite'
    },
    {
      id: 'supercell-passes',
      name: 'SuperCell Pases',
      price: 'Variable',
      guarantee: 'Entrega inmediata',
      description: 'Pases premium de juegos SuperCell'
    },
    {
      id: 'spotify',
      name: 'Spotify Premium',
      price: 'Variable',
      guarantee: 'Suscripción',
      description: 'Spotify Premium - cuenta/mes'
    },
    {
      id: 'netflix',
      name: 'Netflix',
      price: 'Variable',
      guarantee: 'Suscripción',
      description: 'Netflix - cuenta/mes'
    },
    {
      id: 'capcut-pro',
      name: 'CapCut Pro',
      price: 'Variable',
      guarantee: 'Suscripción',
      description: 'CapCut Pro - licencia'
    },
    {
      id: 'chatgpt-plus',
      name: 'Removed - ChatGPT Premium',
      price: 'Variable',
      guarantee: 'Suscripción',
      description: 'Retired - removed from public listings.'
    },
    {
      id: 'dazn',
      name: 'Removed - DAZN',
      price: 'Variable',
      guarantee: 'Suscripción',
      description: 'Retired - removed from public listings.'
    },
    {
      id: 'disneyplus',
      name: 'Removed - Disney+',
      price: 'Variable',
      guarantee: 'Suscripción',
      description: 'Retired - removed from public listings.'
    }
  ],

  // Robux offers removed

  // Lista de métodos de pago soportados (nombres)
  paymentMethodsList: [
    'Paypal', 'Binance', 'Litecoin', 'Bitcoin', 'Upwork', 'Fiverr', 'Nequi', 'Yape', 'Cashapp', 'BancoGuayaquil'
  ],

  // Stock del primer inventario (puedes completar cantidades más tarde)
  storeStock: {
    discordNitro: 0,
    vbucks: 0,
    supercellPasses: 0,
    spotify: 0,
    netflix: 0,
    capcutPro: 0,
    chatgptPlus: 0,
    dazn: 0,
    disneyplus: 0
  },

  // TESTIMONIOS Y CASOS DE ÉXITO
  testimonials: [
    {
      name: 'Carlos López',
      company: 'TechStart México',
      text: 'Liberty Company nos ayudó a tener presencia online en 2 semanas. ¡Increíble!',
      rating: 5,
      image: '👨‍💼'
    },
    {
      name: 'María García',
      company: 'Boutique Madrid',
      text: 'El ecommerce que nos hicieron generó 300% más ventas en el primer mes.',
      rating: 5,
      image: '👩‍💼'
    },
    {
      name: 'Juan Martínez',
      company: 'Consultoría Argentina',
      text: 'El bot IA redujo nuestro tiempo de respuesta 80%. ¡Excelente servicio!',
      rating: 5,
      image: '👨‍💼'
    }
  ],

  // EQUIPO DE TRABAJO
  team: [
    {
      name: 'Mateo Martinez',
      role: 'Founder & CEO',
      bio: 'Creador de Liberty Company. Emprendedor desde 2020 con trayectoria de 5 años en ventas y servicios.',
      image: '🚀'
    },
    {
      name: 'Equipo de Desarrollo',
      role: 'Tech Team',
      bio: 'Desarrolladores y diseñadores web con experiencia en proyectos internacionales.',
      image: '💻'
    },
    {
      name: 'Soporte 24/7',
      role: 'Customer Success',
      bio: 'Equipo dedicado a tu satisfacción. Disponible en múltiples canales.',
      image: '📞'
    }
  ],

  // PREGUNTAS FRECUENTES
  faqs: [
    {
      question: '¿Cuál es la garantía de los productos?',
      answer: 'Todos nuestros productos tienen garantía de 1 mes. Si no estás satisfecho, hacemos revisiones y ajustes sin costo adicional.'
    },
    {
      question: '¿Cómo funciona el sistema de tareas para staff?',
      answer: 'Los administradores pueden asignar tareas por correo. El staff completa la tarea, envía comprobante fotográfico o de video, indica su método de pago preferido y puede dejar notas adicionales.'
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos PayPal, Bitcoin, Litecoin, Nequi, CashApp y transferencias bancarias.'
    },
    {
      question: '¿Cuáles son los horarios de soporte?',
      answer: 'Tenemos soporte 8x5 (Normal), 24x7 (Premium/Ultimate). Respuesta máximo en 1 hora.'
    },
    {
      question: '¿Ofrecen hosting para las páginas web?',
      answer: 'Sí, incluimos hosting premium por 1 año en todos nuestros packs de web design.'
    },
    {
      question: '¿Puedo cambiar de plan después de comprar?',
      answer: 'Sí, durante los primeros 30 días puedes cambiar a un plan superior. La diferencia se cobra de manera proporcional.'
    }
  ],

  // POLÍTICA DE GARANTÍA
  guaranteePolicy: {
    duration: '1 mes',
    description: 'Todos nuestros productos y servicios incluyen garantía de 1 mes desde la fecha de entrega o contratación.',
    included: [
      'Soporte técnico ilimitado',
      'Revisiones y ajustes sin costo',
      'Reemplazo completo si no funcionan',
      'Reembolso si solicitado en tiempo'
    ],
    process: [
      'Contacta a nuestro equipo reportando el problema',
      'Envía evidencia fotográfica o de video',
      'Nuestro equipo analiza tu solicitud en máximo 24 horas',
      'Procedemos con revisiones, ajustes o reembolso según corresponda'
    ]
  }
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
