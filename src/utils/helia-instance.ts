import { createHelia } from 'helia';

let heliaInstance: Awaited<ReturnType<typeof createHelia>> | null = null;

export async function getHeliaInstance() {
  if (!heliaInstance) {
    heliaInstance = await createHelia();
  }
  return heliaInstance;
}
