export const KNOWN_CATEGORY_IDS = {
  CAMPING: "688277b8b1e412cebf53db1b",
  COTTAGE: "688cd5a16933bde04818ebea",
  HOTEL: "688de083f45eb5f578d74bbf",
  VILLA: "6881f134f913338ef00dc750",
};

export const getCategoryRouteName = (
  property,
  categories = [],
  fallbackCategory = ""
) => {
  if (!property) return "Villa";

  // 1. Explicit Category Object with name or slug
  if (property?.category?.name) {
    const n = property.category.name.toLowerCase();
    if (n.includes("camp")) return "Camping";
    if (n.includes("cottage")) return "Cottage";
    if (n.includes("hotel")) return "Hotel";
    return "Villa";
  }
  if (property?.category?.slug) {
    const s = property.category.slug.toLowerCase();
    if (s.includes("camp")) return "Camping";
    if (s.includes("cottage")) return "Cottage";
    if (s.includes("hotel")) return "Hotel";
    return "Villa";
  }

  // 2. Known MongoDB Category IDs
  const catId = String(property?.category || property?.categoryId || "");
  if (catId === KNOWN_CATEGORY_IDS.CAMPING) return "Camping";
  if (catId === KNOWN_CATEGORY_IDS.COTTAGE) return "Cottage";
  if (catId === KNOWN_CATEGORY_IDS.HOTEL) return "Hotel";
  if (catId === KNOWN_CATEGORY_IDS.VILLA) return "Villa";

  // 3. String name or slug check directly on type/propertyType/category
  const propType = String(
    property?.type || property?.propertyType || ""
  ).toLowerCase();
  if (propType.includes("camp")) return "Camping";
  if (propType.includes("cottage")) return "Cottage";
  if (propType.includes("hotel")) return "Hotel";
  if (propType.includes("villa")) return "Villa";

  const catLower = catId.toLowerCase();
  if (catLower.includes("camp")) return "Camping";
  if (catLower.includes("cottage")) return "Cottage";
  if (catLower.includes("hotel")) return "Hotel";
  if (catLower.includes("villa")) return "Villa";

  // 4. Lookup category ID in Redux categories list
  if (categories?.length > 0) {
    const matched = categories.find(
      (c) =>
        c._id === catId ||
        c.slug?.toLowerCase() === catLower ||
        c.name?.toLowerCase() === catLower
    );
    if (matched?.name) {
      const mn = matched.name.toLowerCase();
      if (mn.includes("camp")) return "Camping";
      if (mn.includes("cottage")) return "Cottage";
      if (mn.includes("hotel")) return "Hotel";
      return "Villa";
    }
  }

  // 5. Inspect property structure / signature
  if (
    (property?.tents && property.tents.length > 0) ||
    property?.totaltents ||
    property?.CampingRules ||
    property?.tentConfigurations
  ) {
    return "Camping";
  }
  if (
    (property?.units && property.units.length > 0) ||
    property?.totalcottage ||
    property?.cottageType
  ) {
    return "Cottage";
  }
  if (
    (property?.rooms && property.rooms.length > 0) ||
    property?.hotelType ||
    property?.totalRooms
  ) {
    return "Hotel";
  }

  // 6. Fallback category name if provided (e.g. from Redux or route)
  if (fallbackCategory) {
    const sel = String(fallbackCategory).toLowerCase();
    if (sel.includes("camp")) return "Camping";
    if (sel.includes("cottage")) return "Cottage";
    if (sel.includes("hotel")) return "Hotel";
    if (sel.includes("villa")) return "Villa";
  }

  return "Villa";
};

export const buildPropertyViewUrl = (
  property,
  categories = [],
  fallbackCategory = "",
  checkin = null,
  checkout = null
) => {
  const cat = getCategoryRouteName(property, categories, fallbackCategory);
  const id = property?._id || property?.id;
  const params = new URLSearchParams();
  if (checkin) params.set("checkin", checkin);
  if (checkout) params.set("checkout", checkout);
  const query = params.toString();
  return `/view-${cat}/${id}${query ? `?${query}` : ""}`;
};

export const getCleanPropertyType = (property, categories = [], fallback = "villa") => {
  return getCategoryRouteName(property, categories, fallback).toLowerCase();
};

