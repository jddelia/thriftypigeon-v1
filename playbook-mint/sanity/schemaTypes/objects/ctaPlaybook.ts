import { defineField, defineType } from "sanity";

export default defineType({
  name: "ctaPlaybook",
  title: "CTA Playbook",
  type: "object",
  fields: [
    defineField({
      name: "sku",
      title: "Playbook SKU",
      type: "string",
      validation: (rule) => rule.required().error("Select the playbook SKU to feature in this CTA."),
    }),
  ],
  preview: {
    select: { sku: "sku" },
    prepare({ sku }) {
      return {
        title: "CTA Playbook",
        subtitle: sku || "Missing SKU",
      };
    },
  },
});
