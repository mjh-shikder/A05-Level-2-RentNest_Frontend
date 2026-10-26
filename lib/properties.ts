export type PropertyListing = {
  id: string;
  title: string;
  description: string;
  city: string;
  country: string;
  address: string;
  rent: number;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  furnished: boolean | null;
  status: string;
  category: string;
  images: string[];
  averageRating: number | null;
  totalReviews: number;
};




export type PropertyReview = {
  id: string;
  comment: string;
  rating: number;
  tenantName: string;
};


export type PropertyDetails = PropertyListing & {
  securityDeposit: number | null;
  floor: number | null;
  availableFrom: string | null;
  landlord: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  } | null;
  reviews: PropertyReview[];
};



export class PropertyListingsError extends Error {
  constructor(
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = "PropertyListingsError";
  }
}



const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);


const readText = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;


const readNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;

  }

  return null;

};

const readImages = (value: unknown) =>

  Array.isArray(value)
    ? value.filter((image): image is string => typeof image === "string")
    : typeof value === "string"
      ? value.split(",").map((image) => image.trim()).filter(Boolean)
      : [];

const normalizeListing = (value: unknown): PropertyListing | null => {
  if (!isRecord(value)) return null;
  if (typeof value.id !== "string" || typeof value.title !== "string") {
    return null;
  }

  const rent = readNumber(value.rent);
  if (rent === null || rent < 0) return null;

  const category = isRecord(value.category)
    ? readText(value.category.name)
    : readText(value.category, readText(value.categoryName));

  const rating = readNumber(value.averageRating);
  const reviewCount = readNumber(value.totalReviews);

  return {
    id: value.id,
    title: value.title,
    description: readText(value.description),
    city: readText(value.city),
    country: readText(value.country),
    address: readText(value.address),
    rent,
    bedrooms: readNumber(value.bedrooms),
    bathrooms: readNumber(value.bathrooms),
    area: readNumber(value.area),
    furnished: typeof value.furnished === "boolean" ? value.furnished : null,
    status: readText(value.status, "Status unavailable"),
    category,
    images: readImages(value.images),
    averageRating: rating,
    totalReviews: reviewCount ?? 0,
  };
};

const normalizeReview = (value: unknown): PropertyReview | null => {
  if (!isRecord(value)) return null;


  const rating = readNumber(value.rating);
  if (typeof value.id !== "string" || rating === null) return null;

  const tenant = isRecord(value.tenant) ? value.tenant : null;

  return {
    id: value.id,
    comment: readText(value.comment),
    rating,
    tenantName: tenant ? readText(tenant.name, "Tenant") : "Tenant",
  };
};

const getApiMessage = (body: unknown) => {
  if (!isRecord(body) || typeof body.message !== "string") return null;
  return body.message.trim() || null;
};

const fetchApiData = async (url: string, resourceName: string) => {
  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store" });
  } catch {
    throw new PropertyListingsError(
      `We could not connect to the ${resourceName} service. Please try again.`,
    );
  }

  let body: unknown;

  try {

    body = await response.json();

  } catch {
    
    throw new PropertyListingsError(
      `The ${resourceName} service returned an invalid response.`,
      response.status,
    );
  }

  if (!response.ok) {
    throw new PropertyListingsError(
      getApiMessage(body) ??
        `We could not load ${resourceName} (request failed with status ${response.status}).`,
      response.status,
    );
  }

  const data = isRecord(body) ? body.data : null;
  if (data === null || data === undefined) {
    throw new PropertyListingsError(
      `The ${resourceName} service returned an unexpected response.`,
    );
  }

  return data;

};



export const getPropertyListings = async (): Promise<PropertyListing[]> => {


  const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");


  if (!backendUrl) {

    throw new PropertyListingsError("The property service is not configured.");
  }

  const data = await fetchApiData(
    `${backendUrl}/api/all/properties`,
    "property",
  );


  if (!Array.isArray(data)) {
    throw new PropertyListingsError("The property service returned listings in an unexpected format.",
    );
  }

  const listings = data.map(normalizeListing);


  if (listings.some((listing) => listing === null)) {

    throw new PropertyListingsError(
      "Some property listings could not be displayed because their details are incomplete.",
    );
  }

  return listings.filter((listing): listing is PropertyListing => listing !== null);
};

export const getPropertyDetails = async (id: string,): Promise<PropertyDetails> => {
  
  const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");


  if (!backendUrl) {
    throw new PropertyListingsError("The property service is not configured.");
  }


  const data = await fetchApiData(
`${backendUrl}/api/properties/${encodeURIComponent(id)}`,
    "property",
  );



  const listing = normalizeListing(data);

  if (!listing) {

    throw new PropertyListingsError(
      "The property service returned property details in an unexpected format.",
    );
  }

  const record = isRecord(data) ? data : {};

  const landlord = isRecord(record.landlord) ? record.landlord : null;

  const reviewData = Array.isArray(record.reviews)

    ? record.reviews
    : record.reviews
      ? [record.reviews]
      : [];
  const reviews = reviewData.map(normalizeReview);

  if (reviews.some((review) => review === null)) {
    
    throw new PropertyListingsError(
      "The property service returned incomplete review details.",
    );
  }

  return {
    ...listing,
    securityDeposit: readNumber(record.securityDeposit),
    floor: readNumber(record.floor),
    availableFrom: readText(record.availableFrom) || null,
    landlord: landlord
      ? {
          name: readText(landlord.name, "Property owner"),
          email: readText(landlord.email),
          phone: readText(landlord.phone),
          avatar: readText(landlord.avatar),
        }
      : null,
    reviews: reviews.filter((review): review is PropertyReview => review !== null),
  };
};
