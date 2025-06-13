import { supabase } from './api.clients.js';

let currentSession;

///

main();

///

async function main() {

  console.log('main');

  const { data: sessionData, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session: ', error);
    alert('Błąd podczas pobierania sesji. Sprawdź konsolę');
    return;
  }

  currentSession = sessionData.session;

  
  setupAddArticleButton();

  if (currentSession) {
    setupLogoutButton();
  } else {
    setupLoginButton();
  }

  await fetchArticles();
}

async function fetchArticles(session) {
  const { data, error } = await supabase.from('article').select();

  if (error) {
    console.error('Error fetching articles', error);
    alert('Błąd podczas pobierania artykułów. Sprawdź konsolę.');
    return;
  }

  console.log('Fetched articles:', data);

  const articleList = data.map((article, i) => {
    return `
      ${i > 0 ? '<hr />' : ''}
      <article class="article" data-id="${article.id}">
        <h2 class="font-bold text-2xl">${article.title}</h2>
        <h3 class="font-medium text">${article.subtitle}</h3>
        <div class="flex gap-2 text-sm text-grey-500">
          <address rel="author">${article.author}</address>
          <time datetime="${article.created_at}">${new Date(article.created_at).toLocaleDateString()}</time>
        </div>
        <p class="mt-2">${article.content}</p>
      </article>
    `;
  }).join('');

  document.querySelector('.articles').innerHTML = articleList;

  if (currentSession) {
    setupDeleteArticleButton();
    setupEditArticleButton();
  }
}

function setupLogoutButton() {
  const navbar = document.querySelector('nav');

  const logoutButton = document.createElement('button');
  logoutButton.textContent = 'Wyloguj';
  logoutButton.type = 'button';
  logoutButton.className = "bg-sky-400 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded cursor-pointer";

  logoutButton.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    currentSession = null;
    if (error) {
      console.error('Error signing out:', error);
      alert('Błąd podczas wylogowywania. Sprawdź konsolę.');
      return;
    }

    logoutButton.remove();
    setupLoginButton();
    await fetchArticles();
  });

  navbar.appendChild(logoutButton);
}

function setupLoginButton() {
  const navbar = document.querySelector('nav');

  const loginButton = document.createElement('a');
  loginButton.textContent = 'Zaloguj';
  loginButton.href = '/lab13/login/';
  loginButton.className = "bg-sky-400 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded cursor-pointer";

  navbar.appendChild(loginButton);
}

function setupAddArticleButton() {
  const navbar = document.querySelector('nav');

  const addArticleButton = document.createElement('button');
  addArticleButton.textContent = 'Dodaj artykuł';
  addArticleButton.className = "bg-sky-400 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded cursor-pointer";
  addArticleButton.type = 'button';

  addArticleButton.addEventListener('click', () => {
    const dialog = document.createElement('dialog');
    dialog.className = 'bg-transparent w-full h-full';
    dialog.innerHTML = `
      <section class="bg-white p-4 md:px-8 rounded shadow-lg max-w-md mx-auto mt-20">
        <h2 class="text-2xl font-bold mb-4">Dodaj artykuł</h2>
        <form id="add-article-form" class="flex flex-col gap-4">
          <label>
            Tytuł:
            <input type="text" name="title" required class="border p-2 rounded w-full"/>
          </label>
          <label>
            Podtytuł:
            <input type="text" name="subtitle" required class="border p-2 rounded w-full"/>
          </label>
          <label>
            Treść:
            <textarea name="content" required class="border p-2 rounded w-full"></textarea>
          </label>
          <label>
            Autor:
            <input type="text" name="author" required class="border p-2 rounded w-full"/>
          </label>
          <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded cursor-pointer">Dodaj artykuł</button>
          <button type="button" id="cancel-button" class="bg-rose-500 hover:bg-rose-700 text-white p-2 rounded cursor-pointer">Anuluj</button>
        </form>
      </section>
    `;

    document.body.appendChild(dialog);
    dialog.showModal();

    const form = dialog.querySelector('#add-article-form');
    const cancelButton = dialog.querySelector('#cancel-button');
    
    cancelButton.addEventListener('click', async () => {
      dialog.close();
      dialog.remove();
    })

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const title = event.target.title.value;
      const subtitle = event.target.subtitle.value;
      const content = event.target.content.value;
      const author = event.target.author.value;

      const { error } = await supabase.from('article').insert({
        title,
        subtitle,
        content,
        author,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Error adding article', error);
        if (error.code === "42501" || error.message.includes('violates row-level security')) {
          alert('Musisz być zalogowany, aby dodać artykuł.');
        } else {
          alert('Błąd podczas dodawania artykułu. Sprawdź konsolę.');
        }
        return;
      }

      dialog.close();
      dialog.remove();
      await fetchArticles();
    });
  });

  navbar.appendChild(addArticleButton);
}

function setupDeleteArticleButton() {
  document.querySelectorAll('article').forEach(articleElement => {
    const articleId = articleElement.dataset.id;

    const deleteArticleButton = document.createElement('button');
    deleteArticleButton.textContent = 'Usuń artykuł';
    deleteArticleButton.type = 'button';
    deleteArticleButton.className = "bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 m-1 rounded cursor-pointer";

    deleteArticleButton.addEventListener('click', async () => {
      const confirmed = confirm('Czy na pewno chcesz usunąć ten artykuł?');
      if (!confirmed) return;

      const { error } = await supabase.from('article').delete().eq('id', articleId);

      if (error) {
        console.error('Error deleting article:', error);
        alert('Błąd podczas usuwania artykułu. Sprawdź konsolę.');
        return;
      }

      await fetchArticles(true);
    });

    articleElement.appendChild(deleteArticleButton);
  });
}

function setupEditArticleButton() {
  document.querySelectorAll('article').forEach(articleElement => {
    const articleId = articleElement.dataset.id;

    const editArticleButton = document.createElement('button');
    editArticleButton.textContent = "Edytuj artykuł";
    editArticleButton.type = "button";
    editArticleButton.className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-1 rounded";

    editArticleButton.addEventListener('click', () => {
      const dialog = document.createElement('dialog');
      dialog.className = 'bg-transparent w-full h-full';
      dialog.innerHTML = `
        <section class="bg-white p-4 md:px-8 rounded shadow-lg max-w-md mx-auto mt-20">
          <h2 class="text-2xl font-bold mb-4">Edytuj artykuł</h2>
          <form id="edit-article-form" class="flex flex-col gap-4">
            <label>
              Tytuł:
              <input type="text" name="title" required class="border p-2 rounded w-full"/>
            </label>
          <label>
            Podtytuł:
            <input type="text" name="subtitle" required class="border p-2 rounded w-full"/>
          </label>
            <label>
              Treść:
              <textarea name="content" required class="border p-2 rounded w-full"></textarea>
            </label>
            <label>
              Autor:
              <input type="text" name="author" required class="border p-2 rounded w-full"/>
            </label>
            <button type="submit" class="bg-blue-500 text-white p-2 rounded">Zapisz zmiany</button>
          </form>
        </section>
      `;

      document.body.appendChild(dialog);
      dialog.showModal();

      const form = dialog.querySelector('#edit-article-form');
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const subtitle = event.target.subtitle.value;
        const content = event.target.content.value;
        const author = event.target.author.value;

        const { error } = await supabase.from('article')
          .update({
            title,
            subtitle,
            content,
            author,
            created_at: new Date().toISOString()
          })
          .eq('id', articleId);

        if (error) {
          console.error('Error editing article:', error);
          alert('Błąd podczas edycji artykułu. Sprawdź konsolę.');
          return;
        }

        dialog.close();
        dialog.remove();
        await fetchArticles(true);
      });
    });

    articleElement.appendChild(editArticleButton);
  });
}
///