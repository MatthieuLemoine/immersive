const mockData = {
  proddb: [
    {
      id: '1',
      name: 'John Doe on production',
      status: 'VALIDATED',
      stars: 5,
    },
  ],
  stagingdb: [
    {
      id: '1',
      name: 'John Doe on staging',
      status: 'VALIDATED',
      stars: 5,
    },
  ],
  devdb: [
    {
      id: '1',
      name: 'John Doe on development',
      status: 'VALIDATED',
      stars: 5,
    },
  ],
};

export default ({ database }) => ({
  get: async id => mockData[database].find(item => item.id === id),
  insert: async data => data,
});
