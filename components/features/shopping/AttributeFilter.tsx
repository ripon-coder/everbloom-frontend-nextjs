"use client";

interface AttributeValue {
  id: number;
  attribute_id: number;
  value: string;
}

interface Attribute {
  id: number;
  name: string;
  attribute_values: AttributeValue[];
}

interface AttributeShopProps {
  attributes: Attribute[];
  selectedAttributes: Record<string, string | null>;
  onAttributeSelect: (attributeName: string, value: string) => void;
  isLoading?: boolean;
}

export default function AttributeShop({ 
  attributes, 
  selectedAttributes, 
  onAttributeSelect,
  isLoading = false 
}: AttributeShopProps) {
  if (isLoading) {
    return (
      <div>
        <h3 className="font-medium mb-2">Attributes</h3>
        <p>Loading attributes...</p>
      </div>
    );
  }

  if (attributes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">Attributes</h3>
      {attributes.map((attribute: Attribute) => (
        <div key={attribute.id}>
          <h4 className="font-medium mb-2 text-sm text-gray-700">{attribute.name}</h4>
          <div className="flex gap-2 flex-wrap">
            {attribute.attribute_values.map((value) => (
              <button
                key={value.id}
                onClick={() => onAttributeSelect(attribute.name.toLowerCase(), value.value)}
                className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                  selectedAttributes[attribute.name.toLowerCase()] === value.value
                    ? "bg-orange-50 border-orange-500 text-orange-600"
                    : "hover:bg-gray-100 border-gray-300"
                }`}
              >
                {value.value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
