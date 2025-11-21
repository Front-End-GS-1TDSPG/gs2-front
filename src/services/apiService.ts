import type { AlertaBemEstar, Departamento, Empregado, RegistroHumor, RegistroHumorForm } from "../types/tipoApi";

const API_BASE_URL = import.meta.env.VITE_API_URL as string;;
const TIMEOUT = 10000; // 10 segundos

// Interface para o cache
interface CacheItem {
  data: unknown;
  timestamp: number;
}

// Função auxiliar para fetch com timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Cache simples em memória
const cache = new Map<string, CacheItem>();
const CACHE_DURATION = 30000; // 30 segundos

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

function setToCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// Tipo para erro com propriedade name
interface ErrorWithName extends Error {
  name: string;
}

function isAbortError(error: unknown): error is ErrorWithName {
  return error instanceof Error && error.name === 'AbortError';
}

export const apiService = {
  // RegistroHumor
  async getRegistrosHumor(): Promise<RegistroHumor[]> {
    const cacheKey = 'registros-humor';
    const cached = getFromCache<RegistroHumor[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/humor`);
      if (!response.ok) throw new Error('Erro ao buscar registros de humor');
      const data = await response.json();
      setToCache(cacheKey, data);
      return data;
    } catch (error) {
      if (isAbortError(error)) {
        throw new Error('Timeout: A requisição demorou muito para carregar');
      }
      throw error;
    }
  },

  async createRegistroHumor(registro: RegistroHumorForm): Promise<RegistroHumor> {
    // Invalidar cache após criação
    cache.delete('registros-humor');
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/humor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registro),
    });
    if (!response.ok) throw new Error('Erro ao criar registro de humor');
    return response.json();
  },

  async updateRegistroHumor(id: number, registro: RegistroHumorForm): Promise<RegistroHumor> {
    // Invalidar cache após atualização
    cache.delete('registros-humor');
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/humor/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registro),
    });
    if (!response.ok) throw new Error('Erro ao atualizar registro de humor');
    return response.json();
  },

  async deleteRegistroHumor(id: number): Promise<boolean> {
    // Invalidar cache após deleção
    cache.delete('registros-humor');
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/humor/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar registro de humor');
    return response.status === 204;
  },

  // Empregados
  async getEmpregados(): Promise<Empregado[]> {
    const cacheKey = 'empregados';
    const cached = getFromCache<Empregado[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/empregado`);
      if (!response.ok) throw new Error('Erro ao buscar empregados');
      const data = await response.json();
      setToCache(cacheKey, data);
      return data;
    } catch (error) {
      if (isAbortError(error)) {
        throw new Error('Timeout: A requisição demorou muito para carregar');
      }
      throw error;
    }
  },

  // Departamentos
  async getDepartamentos(): Promise<Departamento[]> {
    const cacheKey = 'departamentos';
    const cached = getFromCache<Departamento[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/departamento`);
      if (!response.ok) throw new Error('Erro ao buscar departamentos');
      const data = await response.json();
      setToCache(cacheKey, data);
      return data;
    } catch (error) {
      if (isAbortError(error)) {
        throw new Error('Timeout: A requisição demorou muito para carregar');
      }
      throw error;
    }
  },

  // Alertas
  async getAlertas(): Promise<AlertaBemEstar[]> {
    const cacheKey = 'alertas';
    const cached = getFromCache<AlertaBemEstar[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/alerta`);
      if (!response.ok) throw new Error('Erro ao buscar alertas');
      const data = await response.json();
      setToCache(cacheKey, data);
      return data;
    } catch (error) {
      if (isAbortError(error)) {
        throw new Error('Timeout: A requisição demorou muito para carregar');
      }
      throw error;
    }
  },
};