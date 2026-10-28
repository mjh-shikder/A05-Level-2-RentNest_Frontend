import { savePropertyAction } from "@/app/dashboard/actions";
import PropertyFormSubmitButton from "@/components/dashboard/PropertyFormSubmitButton";
import type { DashboardRecord } from "@/lib/dashboard-data";

type PropertyCategory = {
  id: string;
  name: string;
};

const fieldClassName =
  "h-10 w-full rounded-xl border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

const getStringValue = (value: unknown) =>
  typeof value === "string" || typeof value === "number" ? String(value) : "";

const getCategoryId = (property?: DashboardRecord) => {
  if (!property) return "";
  if (typeof property.categoryId === "string") return property.categoryId;
  if (
    typeof property.category === "object" &&
    property.category !== null &&
    "id" in property.category &&
    typeof property.category.id === "string"
  ) {
    return property.category.id;
  }
  return "";
};

const PropertyForm = ({
  categories,
  property,
}: {
  categories: PropertyCategory[];
  property?: DashboardRecord;
}) => {
  const images = Array.isArray(property?.images)
    ? property.images.filter((image): image is string => typeof image === "string")
    : typeof property?.images === "string"
      ? property.images.split(",").map((image) => image.trim()).filter(Boolean)
      : [];

  return (
    <form action={savePropertyAction} className="space-y-5">
      {property && (
        <input
          type="hidden"
          name="propertyId"
          value={getStringValue(property.id)}
        />
      )}
      <input
        type="hidden"
        name="status"
        value={
          ["MAINTENANCE", "RENTED"].includes(
            getStringValue(property?.status).trim().toUpperCase(),
          )
            ? getStringValue(property?.status).trim().toUpperCase()
            : "AVAILABLE"
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-foreground">
          Title *
          <input
            name="title"
            required
            defaultValue={getStringValue(property?.title)}
            className={fieldClassName}
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-foreground">
          Property type *
          <select
            name="categoryId"
            required
            defaultValue={getCategoryId(property)}
            className={fieldClassName}
          >
            <option value="" disabled>
              Choose a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-medium text-foreground sm:col-span-2">
          Description
          <textarea
            name="description"
            rows={3}
            required
            defaultValue={getStringValue(property?.description)}
            className={`${fieldClassName} h-auto py-2`}
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-foreground sm:col-span-2">
          Street address *
          <input
            name="address"
            required
            defaultValue={getStringValue(property?.address)}
            className={fieldClassName}
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-foreground">
          City *
          <input
            name="city"
            required
            defaultValue={getStringValue(property?.city)}
            className={fieldClassName}
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-foreground">
          Country *
          <input
            name="country"
            required
            defaultValue={getStringValue(property?.country)}
            className={fieldClassName}
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-foreground">
          Monthly rent (৳) *
          <input
            name="rent"
            type="number"
            min="1"
            step="any"
            required
            defaultValue={getStringValue(property?.rent)}
            className={fieldClassName}
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-foreground">
          Security deposit (৳)
          <input
            name="securityDeposit"
            type="number"
            min="0"
            step="any"
            defaultValue={getStringValue(property?.securityDeposit)}
            className={fieldClassName}
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-foreground">
          Bedrooms
          <input
            name="bedrooms"
            type="number"
            min="0"
            defaultValue={getStringValue(property?.bedrooms)}
            className={fieldClassName}
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-foreground">
          Bathrooms
          <input
            name="bathrooms"
            type="number"
            min="0"
            defaultValue={getStringValue(property?.bathrooms)}
            className={fieldClassName}
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-foreground">
          Area (sq ft)
          <input
            name="area"
            type="number"
            min="0"
            step="any"
            defaultValue={getStringValue(property?.area)}
            className={fieldClassName}
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-foreground">
          Floor
          <input
            name="floor"
            type="number"
            min="0"
            defaultValue={getStringValue(property?.floor)}
            className={fieldClassName}
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-foreground">
          Furnishing
          <select
            name="furnished"
            defaultValue={
              typeof property?.furnished === "boolean"
                ? String(property.furnished)
                : "false"
            }
            className={fieldClassName}
          >
            <option value="false">Unfurnished</option>
            <option value="true">Furnished</option>
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-medium text-foreground">
          Availability *
          <input
            name="availableFrom"
            type="date"
            required
            defaultValue={getStringValue(property?.availableFrom).slice(0, 10)}
            className={fieldClassName}
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-foreground sm:col-span-2">
          Image URLs
          <textarea
            name="images"
            rows={3}
            placeholder="Add one image URL per line"
            defaultValue={images.join("\n")}
            className={`${fieldClassName} h-auto py-2`}
          />
          <span className="block text-xs font-normal text-muted-foreground">
            Use one http or https image URL per line.
          </span>
        </label>
      </div>

      <PropertyFormSubmitButton isUpdate={Boolean(property)} />
    </form>
  );
};

export default PropertyForm;
