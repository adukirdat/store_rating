const storeService = require('../services/storeService');

const listStores = async (request, response, next) => {
  try {
    const stores = await storeService.listStores({ userId: request.user.userId, ...request.query });
    response.status(200).json({ success: true, message: 'Stores retrieved successfully.', data: { stores } });
  } catch (error) {
    next(error);
  }
};

const rateStore = async (request, response, next) => {
  try {
    const result = await storeService.rateStore({
      userId: request.user.userId,
      storeId: request.params.storeId,
      value: request.body.value,
    });

    response.status(result.created ? 201 : 200).json({
      success: true,
      message: result.created ? 'Rating submitted successfully.' : 'Rating updated successfully.',
      data: { rating: result.rating },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { listStores, rateStore };
