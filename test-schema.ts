import { Type } from "@google/genai";

const styleSchema = {
  type: Type.OBJECT,
  properties: {
    color: { type: Type.STRING },
    fontSize: { type: Type.STRING },
    fontWeight: { type: Type.STRING },
    fontFamily: { type: Type.STRING },
    align: { type: Type.STRING },
    bg: { type: Type.STRING },
    radius: { type: Type.STRING },
    paddingX: { type: Type.STRING },
    paddingY: { type: Type.STRING },
    width: { type: Type.STRING },
    height: { type: Type.STRING },
    gap: { type: Type.STRING },
    flexDirection: { type: Type.STRING },
    flexWrap: { type: Type.STRING },
    justifyContent: { type: Type.STRING },
    alignItems: { type: Type.STRING },
    gridTemplateColumns: { type: Type.STRING },
  }
};

function getElementSchema(depth: number = 3): any {
  const schema: any = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "Unique identifier for the element, e.g. elem_123" },
      kind: { type: Type.STRING, description: "Type of widget (e.g. heading, paragraph, button, image, container, grid, flex, card, lottie)" },
      text: { type: Type.STRING, description: "Inner text content or button label" },
      placeholder: { type: Type.STRING, description: "Input or form placeholder text" },
      href: { type: Type.STRING, description: "Link destination URL" },
      imageUrl: { type: Type.STRING, description: "Image source URL" },
      style: styleSchema,
    },
    required: ["kind", "text"],
  };

  if (depth > 0) {
    schema.properties.children = {
      type: Type.ARRAY,
      description: "Nested elements inside this layout element",
      items: getElementSchema(depth - 1)
    };
  }

  return schema;
}

console.log("SCHEMA DEPTH 3 JSON:");
console.log(JSON.stringify(getElementSchema(3), null, 2));
