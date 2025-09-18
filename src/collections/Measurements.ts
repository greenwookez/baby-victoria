import { CollectionConfig } from 'payload'

export const Measurements: CollectionConfig = {
  slug: 'measurements',
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'measured-at',
      type: 'date',
      required: true,
    },
    {
      name: 'weight',
      type: 'number',
    },
    {
      name: 'height',
      type: 'number',
    },
    {
      name: 'head-size',
      type: 'number',
    },
  ],
}
