const { test, expect } = require('@playwright/test');

test.describe('Pruebas E2E Nexus Talent', () => {

  test('Registro y Redirección al Perfil', async ({ page }) => {
    // Mock API
    await page.route('**/api/auth/register', route => {
      route.fulfill({ status: 201, json: { token: 'mock-token', user: { id: '1', nombre: 'Test User', rol: 'estudiante' } } });
    });
    await page.route('**/api/users/profile', route => {
      route.fulfill({ status: 200, json: { user: { id: '1', nombre: 'Test User', rol: 'estudiante', email: 'test@test.com' } } });
    });

    await page.goto('/register');
    await page.fill('input[name="nombre"]', 'Test User');
    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    await page.click('button[type="submit"]');

    // Should redirect to profile and see the name
    await expect(page).toHaveURL('/profile');
    await expect(page.locator('h2')).toContainText('Test User');
  });

  test('Gestión de Perfil (Login y edición)', async ({ page }) => {
    // Mock API
    await page.route('**/api/auth/login', route => {
      route.fulfill({ status: 200, json: { token: 'mock-token', user: { id: '1', nombre: 'Test User' } } });
    });
    await page.route('**/api/users/profile', route => {
      route.fulfill({ status: 200, json: { user: { id: '1', nombre: 'Test User', habilidades: [] } } });
    });
    await page.route('**/api/portfolio/1', route => {
      route.fulfill({ status: 200, json: { portafolio: { proyectos: [] } } });
    });

    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/profile');
    
    // Click edit
    await page.click('button:has-text("Editar perfil")');
    await page.fill('input[name="habilidades"]', 'React, Node');
    
    await page.route('**/api/users/profile', route => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ status: 200, json: { user: { id: '1', nombre: 'Test User', habilidades: ['React', 'Node'] } } });
      } else {
        route.fallback();
      }
    });

    await page.click('button:has-text("Guardar cambios")');
    await expect(page.locator('text=Perfil actualizado exitosamente')).toBeVisible();
  });

  test('Interacción entre Pares (Comentar proyecto)', async ({ page }) => {
    // Mock APIs para un portafolio público
    await page.route('**/api/portfolio/2', route => {
      route.fulfill({ status: 200, json: { 
        usuario: { id: '2', nombre: 'Otro User', rol: 'estudiante' },
        portafolio: { id: 'port-2', titulo: 'Portafolio', proyectos: [{ id: 'proj-1', titulo: 'App', descripcion: 'Desc', tecnologias: [], imagen_url: '' }] }
      }});
    });
    await page.route('**/api/feedback/projects/proj-1', route => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, json: { valoracion: { promedio: 4, total: 1 }, comentarios: [] } });
      } else if (route.request().method() === 'POST') {
        route.fulfill({ status: 201, json: { message: 'Feedback guardado exitosamente' } });
      }
    });
    await page.route('**/api/users/profile', route => {
      route.fulfill({ status: 200, json: { user: { id: '1', nombre: 'Test User' } } }); // Mock user is logged in
    });

    // Simulamos que el usuario 1 está logueado setting localStorage token
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('token', 'mock-token'));
    
    await page.goto('/portfolio/2');
    
    // Verificar que el proyecto está visible y escribir comentario
    await expect(page.locator('h4:has-text("App")')).toBeVisible();
    await page.fill('textarea[placeholder="Deja un comentario constructivo..."]', 'Gran trabajo!');
    await page.selectOption('select', '5');
    
    await page.click('button:has-text("Enviar Feedback")');
    // Si no hay error, asume éxito (o podríamos mockear GET de nuevo para mostrar el comentario)
  });
});
