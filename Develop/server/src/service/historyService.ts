import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class City {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

class HistoryService {
  private filePath: string;
  private history: string[] = [];

  constructor() {
    this.filePath = path.join(__dirname, 'searchHistory.json');
  }

  private async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  private async write(cities: City[]): Promise<void> {
    await fs.promises.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }

  async addCityToHistory(cityName: string): Promise<void> {
    if (!this.history.includes(cityName)) {
      this.history.push(cityName);
    }
  }

  async getHistory(): Promise<string[]> {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      this.history = JSON.parse(data);
      return this.history;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async updateHistory(newHistory: string[]): Promise<void> {
    this.history = newHistory;
    await fs.promises.writeFile(this.filePath, JSON.stringify(this.history, null, 2));
  }
}

export default new HistoryService();