import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(40).warning("Descriptions under 40 characters may hurt SEO."),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      type: "datetime",
    }),
    defineField({
      name: "tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "heroImage",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (rule) => rule.required().error("Hero images must include alt text."),
        }),
      ],
    }),
    defineField({
      name: "heroImageAlt",
      type: "string",
      title: "Hero image alt override",
      description: "Optional override if you need different alt text on article listings.",
    }),
    defineField({
      name: "playbookSku",
      type: "string",
      title: "Featured playbook SKU",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          marks: {
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    validation: (rule) => rule.required(),
                  }),
                  defineField({
                    name: "openInNewTab",
                    title: "Open in new tab",
                    type: "boolean",
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
        defineArrayMember({
          type: "code",
          options: { withFilename: true },
        }),
        defineArrayMember({ type: "ctaPlaybook" }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Publish date (newest first)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "heroImage",
    },
  },
});
