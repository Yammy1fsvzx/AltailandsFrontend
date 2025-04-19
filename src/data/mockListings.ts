import { LandPlot, ListingComplex, CatalogListing } from '@/types/listings';

const sampleLandPlots: LandPlot[] = [
  {
    id: 1,
    slug: 'uchastok-u-reki-katun',
    listing_type: 'landplot',
    title: 'Участок у реки Катунь',
    description: 'Живописный участок ИЖС на берегу Катуни. Рядом лес, отличный подъезд.',
    land_type: 'standard',
    location: {
      id: 10, region: 'Республика Алтай', locality: 'с. Чемал', address_line: 'ул. Береговая, 15', latitude: '51.403', longitude: '86.001'
    },
    cadastral_numbers: '22:00:123456:789',
    land_use_types: [{ id: 1, name: 'ИЖС', description: 'Индивидуальное жилищное строительство'}],
    land_category: { id: 2, name: 'Земли населённых пунктов' },
    features: [{ id: 5, name: 'Электричество', type: 'communication' }],
    area: '15', // Соток
    price: '3500000',
    price_per_are: '233333',
    plot_status: 'available',
    plot_status_display: 'Доступен',
    listing_status: 'published',
    listing_status_display: 'Опубликовано',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T12:30:00Z',
    media_files: [
      { id: 101, file_url: '/images/stock/land1.jpg', type: 'image', is_main: true, order: 1, uploaded_at: '2024-01-15T10:00:00Z'},
      { id: 102, file_url: '/images/stock/land2.jpg', type: 'image', is_main: false, order: 2, uploaded_at: '2024-01-15T10:00:00Z'}
    ]
  },
  {
    id: 2,
    slug: 'bolshoy-uchastok-dlya-fermy',
    listing_type: 'landplot',
    title: 'Большой участок для фермы',
    description: 'Просторный участок ЛПХ, ровный, рядом с дорогой. Отлично подойдет для фермерского хозяйства.',
    land_type: 'standard',
    location: {
      id: 11, region: 'Алтайский край', locality: 'с. Алтайское', address_line: null, latitude: '51.948', longitude: '85.950'
    },
    land_use_types: [{ id: 2, name: 'ЛПХ', description: 'Личное подсобное хозяйство'}],
    land_category: null,
    area: '150', // Соток
    price: '5000000',
    plot_status: 'available',
    plot_status_display: 'Доступен',
    listing_status: 'published',
    listing_status_display: 'Опубликовано',
    created_at: '2024-02-01T11:00:00Z',
    updated_at: '2024-02-05T15:00:00Z',
    media_files: [
      { id: 103, file_url: '/images/stock/land3.jpg', type: 'image', is_main: true, order: 1, uploaded_at: '2024-02-01T11:00:00Z'}
    ]
  },
  {
    id: 3,
    slug: 'uchastok-v-gorah-s-vidom',
    listing_type: 'landplot',
    title: 'Участок в горах с видом',
    description: 'ИЖС, небольшой уклон, панорамный вид.',
    land_type: 'standard',
    location: {
      id: 12, region: 'Республика Алтай', locality: 'с. Аскат', address_line: null, latitude: '51.530', longitude: '85.880'
    },
    land_use_types: [{ id: 1, name: 'ИЖС'}],
    area: '12',
    price: '2800000',
    plot_status: 'available',
    listing_status: 'published',
    created_at: '2024-03-10T09:00:00Z',
    updated_at: '2024-03-11T10:00:00Z',
    media_files: [
      { id: 104, file_url: '/images/stock/land4.jpg', type: 'image', is_main: true, order: 1, uploaded_at: '2024-03-10T09:00:00Z'}
    ]
  },
];

const sampleComplexes: ListingComplex[] = [
  {
    id: 101,
    slug: 'zhk-altayskaya-riviera',
    listing_type: 'complex',
    name: 'ЖК \"Алтайская Ривьера\"',
    description: 'Современный жилой комплекс с видом на горы. Квартиры с отделкой и без.',
    location: {
      id: 20, region: 'Республика Алтай', locality: 'г. Горно-Алтайск', address_line: 'ул. Чорос-Гуркина, 45', latitude: '51.958', longitude: '85.961'
    },
    complex_type: 'residential_complex',
    complex_type_display: 'Жилой комплекс',
    features: [{ id: 10, name: 'Закрытая территория', type: 'infrastructure' }, {id: 11, name: 'Детская площадка', type: 'infrastructure'}],
    developer_name: 'СтройКомфорт',
    deadline_quarter: 4,
    deadline_year: 2025,
    price: '4500000', 
    listing_status: 'published',
    listing_status_display: 'Опубликовано',
    created_at: '2023-11-10T09:00:00Z',
    updated_at: '2024-01-25T18:00:00Z',
    media_files: [
       { id: 201, file_url: '/images/stock/complex1.jpg', type: 'image', is_main: true, order: 1, uploaded_at: '2023-11-10T09:00:00Z'},
       { id: 202, file_url: '/images/stock/complex2.jpg', type: 'image', is_main: false, order: 2, uploaded_at: '2023-11-10T09:00:00Z'}
    ]
  },
   {
    id: 102,
    slug: 'apart-otel-gory',
    listing_type: 'complex',
    name: 'Апарт-отель \"Горы\"',
    description: 'Апартаменты для отдыха и инвестиций в туристической зоне.',
    location: {
      id: 21, region: 'Республика Алтай', locality: 'с. Манжерок', address_line: 'ул. Лесная, 1', latitude: '51.817', longitude: '85.784'
    },
    complex_type: 'apart_hotel',
    complex_type_display: 'Апарт-отель',
    price: '5200000',
    listing_status: 'published',
    listing_status_display: 'Опубликовано',
    created_at: '2024-03-01T14:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
    media_files: [
       { id: 203, file_url: '/images/stock/complex3.jpg', type: 'image', is_main: true, order: 1, uploaded_at: '2024-03-01T14:00:00Z'}
    ]
  },
  {
    id: 103,
    slug: 'kp-solnechnaya-dolina',
    listing_type: 'complex',
    name: 'КП \"Солнечная Долина\"',
    description: 'Коттеджный поселок в экологически чистом районе.',
    location: {
      id: 22, region: 'Алтайский край', locality: 'с. Смоленское', address_line: 'ул. Цветочная', latitude: '52.300', longitude: '85.065'
    },
    complex_type: 'cottage_village',
    complex_type_display: 'Коттеджный поселок',
    price: '6800000',
    listing_status: 'published',
    created_at: '2024-02-15T12:00:00Z',
    updated_at: '2024-03-05T11:00:00Z',
    media_files: [
      { id: 204, file_url: '/images/stock/complex4.jpg', type: 'image', is_main: true, order: 1, uploaded_at: '2024-02-15T12:00:00Z'}
    ]
  },
];

// Снова убираем объединенный массив
// export const mockCatalogListings: CatalogListing[] = [...sampleLandPlots, ...sampleComplexes]
//   .sort(() => 0.5 - Math.random());

// Оставляем только экспорт по отдельности
export { sampleLandPlots, sampleComplexes }; 