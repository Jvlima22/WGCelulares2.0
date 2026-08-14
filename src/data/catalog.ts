export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  brand: string;
  color: string;
  price: number;
  oldPrice?: number;
  stock: number;
  rating: number;
  reviews: number;
  badge?: "Novo" | "Mais vendido";
  featured?: boolean;
  variants: string[];
  short: string;
  description: string;
};

export const categories: Category[] = [
  { slug: "capas", name: "Capas", description: "Proteção com estilo para o seu aparelho", icon: "shield" },
  { slug: "peliculas", name: "Películas", description: "Vidro 3D, privacidade e antishock", icon: "layers" },
  { slug: "cabos-e-carregadores", name: "Cabos e Carregadores", description: "Carga rápida com segurança", icon: "cable" },
  { slug: "fones", name: "Fones", description: "Bluetooth, com fio e gamer", icon: "headphones" },
  { slug: "relogios-e-acessorios", name: "Relógios e Acessórios", description: "Smartwatches, pulseiras e suportes", icon: "watch" },
  { slug: "adaptadores", name: "Adaptadores", description: "USB-C, HDMI, OTG e mais", icon: "plug" },
];

export const brands = ["iPhone", "Samsung", "Xiaomi", "Motorola", "Universal"];
export const colors = ["Preto", "Transparente", "Branco", "Azul", "Rosa"];

export const products: Product[] = [
  {
    slug: "capa-antishock-transparente",
    name: "Capa Antishock Transparente Premium",
    category: "capas",
    brand: "iPhone",
    color: "Transparente",
    price: 59.9,
    oldPrice: 89.9,
    stock: 24,
    rating: 4.8,
    reviews: 132,
    badge: "Mais vendido",
    featured: true,
    variants: ["iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16"],
    short: "Bordas reforçadas e antiamarelamento.",
    description:
      "Capa em TPU premium com tecnologia antishock nas quatro bordas, tratamento antiamarelamento e recortes precisos para câmeras e botões. Compatível com carregamento por indução.",
  },
  {
    slug: "capa-silicone-aveludada",
    name: "Capa Silicone Aveludada",
    category: "capas",
    brand: "Samsung",
    color: "Azul",
    price: 49.9,
    stock: 18,
    rating: 4.6,
    reviews: 71,
    variants: ["Galaxy S23", "Galaxy S24", "Galaxy A54"],
    short: "Toque macio com interior em microfibra.",
    description:
      "Silicone líquido com acabamento aveludado e forro interno em microfibra que evita riscos na traseira do aparelho.",
  },
  {
    slug: "pelicula-vidro-3d",
    name: "Película de Vidro 3D Full Cover",
    category: "peliculas",
    brand: "iPhone",
    color: "Preto",
    price: 39.9,
    oldPrice: 59.9,
    stock: 40,
    rating: 4.9,
    reviews: 210,
    badge: "Mais vendido",
    featured: true,
    variants: ["iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15"],
    short: "Cobertura total com aplicação gratuita na loja.",
    description:
      "Vidro temperado 9H com cobertura total da tela, camada oleofóbica e alta sensibilidade ao toque. Aplicação gratuita na nossa loja física.",
  },
  {
    slug: "pelicula-privacidade",
    name: "Película de Privacidade Anti-Espião",
    category: "peliculas",
    brand: "Samsung",
    color: "Preto",
    price: 54.9,
    stock: 15,
    rating: 4.5,
    reviews: 48,
    badge: "Novo",
    variants: ["Galaxy S23", "Galaxy S24"],
    short: "Só você enxerga a sua tela.",
    description:
      "Filtro de privacidade que escurece a tela em ângulos laterais, ideal para uso em transporte público e ambientes de trabalho.",
  },
  {
    slug: "carregador-turbo-30w",
    name: "Carregador Turbo 30W USB-C",
    category: "cabos-e-carregadores",
    brand: "Universal",
    color: "Branco",
    price: 99.9,
    oldPrice: 129.9,
    stock: 30,
    rating: 4.7,
    reviews: 96,
    featured: true,
    variants: ["Bivolt"],
    short: "Carga rápida com proteção contra sobrecarga.",
    description:
      "Fonte GaN compacta de 30W com Power Delivery, proteção contra sobreaquecimento, sobrecarga e curto-circuito.",
  },
  {
    slug: "cabo-nylon-usbc-lightning",
    name: "Cabo Nylon USB-C / Lightning 1,5m",
    category: "cabos-e-carregadores",
    brand: "iPhone",
    color: "Preto",
    price: 44.9,
    stock: 52,
    rating: 4.6,
    reviews: 88,
    featured: true,
    variants: ["1,5m", "2m"],
    short: "Malha reforçada para durar muito mais.",
    description:
      "Cabo com malha de nylon trançado, conectores em alumínio e suporte a carga rápida de até 30W.",
  },
  {
    slug: "fone-bluetooth-tws-pro",
    name: "Fone Bluetooth TWS Pro",
    category: "fones",
    brand: "Universal",
    color: "Branco",
    price: 179.9,
    oldPrice: 229.9,
    stock: 12,
    rating: 4.7,
    reviews: 154,
    badge: "Mais vendido",
    featured: true,
    variants: ["Branco", "Preto"],
    short: "Cancelamento de ruído e 24h de bateria.",
    description:
      "Fone true wireless com cancelamento ativo de ruído, Bluetooth 5.3, estojo com carregamento rápido e autonomia total de 24 horas.",
  },
  {
    slug: "fone-com-fio-hifi",
    name: "Fone com Fio HiFi USB-C",
    category: "fones",
    brand: "Universal",
    color: "Preto",
    price: 69.9,
    stock: 22,
    rating: 4.3,
    reviews: 33,
    variants: ["USB-C", "P2"],
    short: "Áudio limpo, sem depender de bateria.",
    description: "Drivers de 10mm com resposta equilibrada, microfone embutido e controle de volume no cabo.",
  },
  {
    slug: "smartwatch-fit-9",
    name: "Smartwatch Fit 9 com GPS",
    category: "relogios-e-acessorios",
    brand: "Universal",
    color: "Preto",
    price: 349.9,
    oldPrice: 449.9,
    stock: 8,
    rating: 4.5,
    reviews: 62,
    badge: "Novo",
    featured: true,
    variants: ["Preto", "Rosa"],
    short: "Monitoramento completo e chamadas por Bluetooth.",
    description:
      "Tela AMOLED 1.9\", GPS integrado, medição de batimentos e oxigenação, mais de 100 modos esportivos e resistência IP68.",
  },
  {
    slug: "pulseira-silicone-esportiva",
    name: "Pulseira Esportiva de Silicone",
    category: "relogios-e-acessorios",
    brand: "Universal",
    color: "Rosa",
    price: 39.9,
    stock: 35,
    rating: 4.4,
    reviews: 27,
    variants: ["38/40/41mm", "42/44/45mm"],
    short: "Confortável para treinar todos os dias.",
    description: "Silicone macio hipoalergênico com fecho reforçado e furos de ventilação.",
  },
  {
    slug: "adaptador-usbc-hdmi",
    name: "Adaptador USB-C para HDMI 4K",
    category: "adaptadores",
    brand: "Universal",
    color: "Branco",
    price: 129.9,
    stock: 10,
    rating: 4.6,
    reviews: 41,
    variants: ["4K 30Hz"],
    short: "Conecte o celular na TV em segundos.",
    description: "Adaptador com saída HDMI 4K, chip de conversão estável e carcaça em alumínio.",
  },
  {
    slug: "adaptador-otg-usbc",
    name: "Adaptador OTG USB-C / USB-A",
    category: "adaptadores",
    brand: "Universal",
    color: "Preto",
    price: 29.9,
    oldPrice: 39.9,
    stock: 44,
    rating: 4.2,
    reviews: 19,
    variants: ["Unidade", "Kit com 2"],
    short: "Pendrives e teclados direto no celular.",
    description: "Adaptador compacto para conectar dispositivos USB-A em smartphones e tablets com entrada USB-C.",
  },
];

export type Service = {
  slug: string;
  name: string;
  icon: string;
  short: string;
  description: string;
  fromPrice: number;
  duration: string;
};

export const services: Service[] = [
  {
    slug: "troca-de-tela",
    name: "Troca de Tela",
    icon: "smartphone",
    short: "Display original ou premium com garantia de 90 dias.",
    description:
      "Substituição de display trincado, com manchas, listras ou touch sem resposta. Trabalhamos com peças originais e premium, testadas antes da entrega.",
    fromPrice: 199,
    duration: "A partir de 1 hora",
  },
  {
    slug: "troca-de-bateria",
    name: "Troca de Bateria",
    icon: "battery-charging",
    short: "Recupere a autonomia do seu aparelho no mesmo dia.",
    description:
      "Baterias novas com ciclo zero e teste de saúde após a instalação. Indicado para aparelhos que desligam sozinhos ou descarregam rápido.",
    fromPrice: 149,
    duration: "Cerca de 40 minutos",
  },
  {
    slug: "conector-de-carga",
    name: "Conector de Carga",
    icon: "plug-zap",
    short: "Celular que não carrega ou só carrega em certa posição.",
    description:
      "Limpeza ou substituição do conector de carga, com teste de corrente e verificação do circuito de carregamento.",
    fromPrice: 129,
    duration: "Cerca de 1 hora",
  },
  {
    slug: "desoxidacao",
    name: "Desoxidação",
    icon: "droplets",
    short: "Recuperação de aparelhos que caíram na água.",
    description:
      "Limpeza ultrassônica da placa, remoção de oxidação e substituição de componentes danificados. Quanto antes o atendimento, maior a chance de recuperação.",
    fromPrice: 179,
    duration: "1 a 3 dias úteis",
  },
  {
    slug: "reparo-de-placa",
    name: "Reparo de Placa / CPU",
    icon: "cpu",
    short: "Microssoldagem para casos que outras lojas recusam.",
    description:
      "Diagnóstico com microscópio e estação de retrabalho para falhas em CI de carga, áudio, imagem, reballing e reparo de trilhas.",
    fromPrice: 249,
    duration: "2 a 5 dias úteis",
  },
  {
    slug: "atualizacao-de-software",
    name: "Atualização de Software",
    icon: "refresh-ccw",
    short: "Aparelho travando, lento ou preso na logo.",
    description:
      "Atualização, reinstalação de sistema e remoção de travamentos, sempre com orientação sobre backup dos seus dados.",
    fromPrice: 99,
    duration: "Cerca de 2 horas",
  },
];

export const faq = [
  {
    q: "Vocês dão garantia nos serviços?",
    a: "Sim. Todos os reparos têm 90 dias de garantia, cobrindo a peça substituída e a mão de obra.",
  },
  {
    q: "Quanto tempo demora um conserto?",
    a: "Trocas de tela e bateria costumam ficar prontas em até 1 hora. Reparos de placa e desoxidação levam de 2 a 5 dias úteis.",
  },
  { q: "O orçamento é cobrado?", a: "Não. A avaliação e o orçamento são gratuitos e sem compromisso." },
  {
    q: "As peças são originais?",
    a: "Trabalhamos com peças originais e premium homologadas. Você escolhe a opção depois de ver o preço de cada uma.",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "Sim. Não acessamos conteúdo pessoal e recomendamos sempre fazer backup antes de deixar o aparelho.",
  },
  { q: "Vocês atendem qual marca?", a: "Atendemos iPhone, Samsung, Xiaomi, Motorola, LG, Asus e outras marcas." },
  {
    q: "Preciso agendar horário?",
    a: "Não é obrigatório, mas você pode adiantar o atendimento chamando no WhatsApp antes de ir à loja.",
  },
  { q: "Quais as formas de pagamento?", a: "Pix, dinheiro e cartões de crédito e débito, com parcelamento disponível." },
  {
    q: "Fazem entrega dos produtos da loja?",
    a: "Sim. Enviamos para todo o Brasil e o frete é grátis em compras acima de R$150. Também dá para retirar na loja.",
  },
  {
    q: "Onde vocês ficam?",
    a: "No Shopping Open Mall The Square, em Cotia (SP), com estacionamento gratuito para clientes.",
  },
];

export const team = [
  { name: "Wagner Gomes", role: "Fundador e técnico chefe", specialty: "Microssoldagem e reparo de placa" },
  { name: "Rafael Souza", role: "Técnico sênior", specialty: "Troca de tela e bateria em iPhone" },
  { name: "Camila Duarte", role: "Técnica", specialty: "Desoxidação e diagnóstico avançado" },
  { name: "Bruno Alves", role: "Atendimento e loja", specialty: "Acessórios e aplicação de películas" },
];

export const testimonials = [
  {
    name: "Fernanda M.",
    rating: 5,
    text: "Troquei a tela do meu iPhone e ficou pronto em 50 minutos. Atendimento muito honesto, explicaram tudo antes.",
  },
  { name: "Diego R.", rating: 5, text: "Celular caiu na piscina e eu já tinha desistido. Recuperaram tudo, inclusive as fotos." },
  { name: "Patrícia L.", rating: 5, text: "Comprei capa e película, aplicaram na hora sem cobrar nada a mais. Recomendo demais." },
  { name: "Marcos A.", rating: 4, text: "Preço justo e prazo cumprido. A bateria voltou a durar o dia inteiro." },
  { name: "Juliana S.", rating: 5, text: "Já é a terceira vez que levo aparelhos da família. Confiança total, 22 anos de casa não é à toa." },
];

export const contact = {
  whatsapp: "5511957303961",
  whatsappLabel: "(11) 95730-3961",
  email: "wg.celulares@outlook.com",
  instagramHandle: "@wgcelulares_thesquare",
  instagram: "https://instagram.com/wgcelulares_thesquare",
  address: "Rod. Raposo Tavares, km 22 — Lageadinho, Cotia - SP, 06709-015",
  addressShort: "Open Mall The Square — Rod. Raposo Tavares, km 22, Cotia/SP",
  hours: "Todos os dias, das 9h às 20h",
  parking: "Estacionamento gratuito para clientes do shopping",
  mapsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent("Rod. Raposo Tavares, km 22 - Lageadinho, Cotia - SP, 06709-015"),
  reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJ",
  mapEmbed:
    "https://www.google.com/maps?q=" +
    encodeURIComponent("Rod. Raposo Tavares, km 22 - Lageadinho, Cotia - SP, 06709-015") +
    "&output=embed",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
