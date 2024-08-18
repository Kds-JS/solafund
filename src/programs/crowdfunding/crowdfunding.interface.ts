export type CrowdfundingProgram = {
  version: '0.1.0';
  name: 'crowdfunding';
  instructions: [
    {
      name: 'createCampaign';
      accounts: [
        {
          name: 'signer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'campaign';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'title';
          type: 'string';
        },
        {
          name: 'description';
          type: 'string';
        },
        {
          name: 'orgName';
          type: 'string';
        },
        {
          name: 'projectLink';
          type: 'string';
        },
        {
          name: 'projectImage';
          type: 'string';
        },
        {
          name: 'goal';
          type: 'u64';
        },
        {
          name: 'startAt';
          type: 'i64';
        },
        {
          name: 'endAt';
          type: 'i64';
        },
      ];
    },
    {
      name: 'cancelCampaign';
      accounts: [
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'campaign';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'donate';
      accounts: [
        {
          name: 'signer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'campaign';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'contribution';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'cancelDonation';
      accounts: [
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'campaign';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'contribution';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'claimDonations';
      accounts: [
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'campaign';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [];
    },
  ];
  accounts: [
    {
      name: 'campaign';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'authority';
            type: 'publicKey';
          },
          {
            name: 'donationCompleted';
            type: 'bool';
          },
          {
            name: 'claimed';
            type: 'bool';
          },
          {
            name: 'title';
            type: 'string';
          },
          {
            name: 'description';
            type: 'string';
          },
          {
            name: 'orgName';
            type: 'string';
          },
          {
            name: 'projectLink';
            type: 'string';
          },
          {
            name: 'projectImage';
            type: 'string';
          },
          {
            name: 'goal';
            type: 'u64';
          },
          {
            name: 'totalDonated';
            type: 'u64';
          },
          {
            name: 'startAt';
            type: 'i64';
          },
          {
            name: 'endAt';
            type: 'i64';
          },
        ];
      };
    },
    {
      name: 'contribution';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'campaign';
            type: 'publicKey';
          },
          {
            name: 'authority';
            type: 'publicKey';
          },
          {
            name: 'amount';
            type: 'u64';
          },
        ];
      };
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'StartTimeEarly';
      msg: 'start time is too early';
    },
    {
      code: 6001;
      name: 'EndTimeSmall';
      msg: 'end time is too small';
    },
    {
      code: 6002;
      name: 'GoalZero';
      msg: 'goal must be greater than zero';
    },
    {
      code: 6003;
      name: 'AmountZero';
      msg: 'amount must be greater than zero';
    },
    {
      code: 6004;
      name: 'CampaignNotStarted';
      msg: 'campaign is not started';
    },
    {
      code: 6005;
      name: 'CampaignStarted';
      msg: 'campaign has already started';
    },
    {
      code: 6006;
      name: 'CampaignNotOver';
      msg: 'campaign is not over';
    },
    {
      code: 6007;
      name: 'CampaignOver';
      msg: 'campaign over';
    },
    {
      code: 6008;
      name: 'DonationCompleted';
      msg: 'donation completed';
    },
    {
      code: 6009;
      name: 'DonationNotCompleted';
      msg: 'donations is not completed';
    },
    {
      code: 6010;
      name: 'DonationsClaimed';
      msg: 'donations has already claimed';
    },
    {
      code: 6011;
      name: 'SignerIsNotAuthority';
      msg: 'signer is not authority';
    },
  ];
};

export const IDL: CrowdfundingProgram = {
  version: '0.1.0',
  name: 'crowdfunding',
  instructions: [
    {
      name: 'createCampaign',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'campaign',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'title',
          type: 'string',
        },
        {
          name: 'description',
          type: 'string',
        },
        {
          name: 'orgName',
          type: 'string',
        },
        {
          name: 'projectLink',
          type: 'string',
        },
        {
          name: 'projectImage',
          type: 'string',
        },
        {
          name: 'goal',
          type: 'u64',
        },
        {
          name: 'startAt',
          type: 'i64',
        },
        {
          name: 'endAt',
          type: 'i64',
        },
      ],
    },
    {
      name: 'cancelCampaign',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'campaign',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'donate',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'campaign',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'contribution',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'cancelDonation',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'campaign',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'contribution',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'claimDonations',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'campaign',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'campaign',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'donationCompleted',
            type: 'bool',
          },
          {
            name: 'claimed',
            type: 'bool',
          },
          {
            name: 'title',
            type: 'string',
          },
          {
            name: 'description',
            type: 'string',
          },
          {
            name: 'orgName',
            type: 'string',
          },
          {
            name: 'projectLink',
            type: 'string',
          },
          {
            name: 'projectImage',
            type: 'string',
          },
          {
            name: 'goal',
            type: 'u64',
          },
          {
            name: 'totalDonated',
            type: 'u64',
          },
          {
            name: 'startAt',
            type: 'i64',
          },
          {
            name: 'endAt',
            type: 'i64',
          },
        ],
      },
    },
    {
      name: 'contribution',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'campaign',
            type: 'publicKey',
          },
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'amount',
            type: 'u64',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'StartTimeEarly',
      msg: 'start time is too early',
    },
    {
      code: 6001,
      name: 'EndTimeSmall',
      msg: 'end time is too small',
    },
    {
      code: 6002,
      name: 'GoalZero',
      msg: 'goal must be greater than zero',
    },
    {
      code: 6003,
      name: 'AmountZero',
      msg: 'amount must be greater than zero',
    },
    {
      code: 6004,
      name: 'CampaignNotStarted',
      msg: 'campaign is not started',
    },
    {
      code: 6005,
      name: 'CampaignStarted',
      msg: 'campaign has already started',
    },
    {
      code: 6006,
      name: 'CampaignNotOver',
      msg: 'campaign is not over',
    },
    {
      code: 6007,
      name: 'CampaignOver',
      msg: 'campaign over',
    },
    {
      code: 6008,
      name: 'DonationCompleted',
      msg: 'donation completed',
    },
    {
      code: 6009,
      name: 'DonationNotCompleted',
      msg: 'donations is not completed',
    },
    {
      code: 6010,
      name: 'DonationsClaimed',
      msg: 'donations has already claimed',
    },
    {
      code: 6011,
      name: 'SignerIsNotAuthority',
      msg: 'signer is not authority',
    },
  ],
};
