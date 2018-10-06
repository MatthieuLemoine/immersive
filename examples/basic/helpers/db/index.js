const mockData = [
  {
    id: '1',
    name: 'John Doe',
    status: 'VALIDATED',
    stars: 5,
  },
];

module.exports = () => ({
  get: async id => mockData.find(item => item.id === id),
  insert: async data => data,
});
