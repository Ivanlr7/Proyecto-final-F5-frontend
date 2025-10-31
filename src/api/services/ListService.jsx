import ListRepository from '../repositories/ListRepository';

class ListService {
  constructor() {
    this.listRepository = new ListRepository();
  }

  async createList(listRequest, token) {
    if (!token) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    return await this.listRepository.createList(listRequest, token);
  }

  async getAllLists() {
    return await this.listRepository.getAllLists();
  }

  async getListById(id) {
    return await this.listRepository.getListById(id);
  }

  async getListsByUser(userId) {
    return await this.listRepository.getListsByUser(userId);
  }

  async updateList(id, listRequest, token) {
    if (!token) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    return await this.listRepository.updateList(id, listRequest, token);
  }

  async deleteList(id, token) {
    if (!token) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    return await this.listRepository.deleteList(id, token);
  }
}

export default ListService;
