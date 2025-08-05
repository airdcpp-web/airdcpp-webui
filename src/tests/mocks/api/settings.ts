export const SettingUserPageDefinitionsResponse = [
  {
    default_value: 'eetuv',
    key: 'nick',
    title: 'Nick',
    type: 'string',
  },
  {
    default_value: '',
    key: 'description',
    optional: true,
    title: 'Description',
    type: 'string',
  },
  {
    default_value: '',
    key: 'email',
    optional: true,
    title: 'E-Mail',
    type: 'string',
  },
  {
    default_value: 0,
    key: 'setting_profile',
    min: 0,
    options: [
      {
        id: 0,
        name: 'Normal',
      },
      {
        id: 1,
        name: 'RAR hubs',
      },
      {
        id: 2,
        name: 'LAN/WAN hubs',
      },
    ],
    title: 'Settings profile',
    type: 'number',
  },
  {
    default_value: '',
    key: 'language_file',
    optional: true,
    options: [
      {
        id: '',
        name: 'English',
      },
      {
        id: 'eu.xml',
        name: 'Basque',
      },
      {
        id: 'ca.xml',
        name: 'Catalan',
      },
      {
        id: 'da-DK.xml',
        name: 'Danish (Denmark)',
      },
      {
        id: 'nl-NL.xml',
        name: 'Dutch (Netherlands)',
      },
      {
        id: 'fi-FI.xml',
        name: 'Finnish (Finland)',
      },
      {
        id: 'fr-FR.xml',
        name: 'French (France)',
      },
      {
        id: 'de-DE.xml',
        name: 'German (Germany)',
      },
      {
        id: 'hu-HU.xml',
        name: 'Hungarian (Hungary)',
      },
      {
        id: 'it-IT.xml',
        name: 'Italian (Italy)',
      },
      {
        id: 'no-NO.xml',
        name: 'Norwegian (Norway)',
      },
      {
        id: 'pl-PL.xml',
        name: 'Polish (Poland)',
      },
      {
        id: 'pt-PT.xml',
        name: 'Portuguese',
      },
      {
        id: 'pt-BR.xml',
        name: 'Portuguese (Brazil)',
      },
      {
        id: 'ro-RO.xml',
        name: 'Romanian (Romania)',
      },
      {
        id: 'ru-RU.xml',
        name: 'Russian (Russia)',
      },
      {
        id: 'es-ES.xml',
        name: 'Spanish (Spain)',
      },
      {
        id: 'sv-SE.xml',
        name: 'Swedish (Sweden)',
      },
      {
        id: 'uk-UA.xml',
        name: 'Ukrainian (Ukraine)',
      },
    ],
    title: 'Language',
    type: 'string',
  },
];

export const SettingUserPageValuesResponse = {
  description: 'My description',
  email: '',
  language_file: '',
  nick: 'maksis',
  setting_profile: 0,
};
