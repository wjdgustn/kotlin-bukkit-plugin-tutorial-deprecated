const branch = 'master';

window.onload = async () => {
    if(!window.location.hostname.endsWith('.github.io')) throw new Error('Here is not github.io website.');
    const repo = `${window.location.hostname.replace('.github.io', '')}/${window.location.pathname == '/' ? window.location.hostname : (window.location.pathname.replace('/', '').split('/')[0])}`;

    let page = 1;
    if(window.location.search.startsWith('?page=')) page = window.location.search.replace('?page=', '');
    if(!isNaN(page)) page = Number(page);
    else page = 1;

    await renderPost(repo, branch, page);

    document.getElementById('page_p').onclick = async () => {
        page--;
        await renderPost(repo, branch, page);
    }

    document.getElementById('page_n').onclick = async () => {
        page++;
        await renderPost(repo, branch, page);
    }
}

async function renderPost(repo, branch, page) {
    const result = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/raw/${page}.md`);
    const text = await result.text();

    if(result.status == 404) document.getElementById('main').innerHTML = '<h1>글이 존재하지 않습니다!</h1>';
    else document.getElementById('main').innerHTML = marked(text);

    history.pushState(null, null, `?page=${page}`);

    if(page < 2) document.getElementById('page_p').hidden = true;
    else document.getElementById('page_p').hidden = false;
    return;
}