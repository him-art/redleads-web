
async function test() {
    console.log('Testing react-dom/server import...');
    try {
        const { renderToStaticMarkup } = await import('react-dom/server');
        console.log('Import successful:', typeof renderToStaticMarkup);
        const html = renderToStaticMarkup({ type: 'div', props: { children: 'Hello' } } as any);
        console.log('Render successful:', html);
    } catch (e: any) {
        console.error('Import failed:', e.message);
    }
}

test();
