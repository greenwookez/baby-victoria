import { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  lockDocuments: false,
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'event-type',
      type: 'relationship',
      relationTo: 'events-types',
    },
    {
      name: 'routine',
      type: 'relationship',
      relationTo: 'routines',
    },
    {
      name: 'scheduled-for',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'completed-at',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
