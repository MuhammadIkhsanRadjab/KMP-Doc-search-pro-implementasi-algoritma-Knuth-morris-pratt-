// Tab Navigation
function showTab(name) {
    const folderTab = document.getElementById('tab-folder');
    const uploadTab = document.getElementById('tab-upload');
    const folderBtn = document.getElementById('btn-folder');
    const uploadBtn = document.getElementById('btn-upload');
    
    if (name === 'folder') {
        folderTab.classList.remove('hidden');
        uploadTab.classList.add('hidden');
        folderBtn.classList.add('active');
        uploadBtn.classList.remove('active');
    } else {
        folderTab.classList.add('hidden');
        uploadTab.classList.remove('hidden');
        uploadBtn.classList.add('active');
        folderBtn.classList.remove('active');
    }
}

// Toggle Results Visibility
function toggleResults() {
    const moreResults = document.getElementById('more-results');
    const toggleBtn = document.getElementById('btn-toggle');
    const othersText = document.getElementById('others-text');
    
    if (moreResults.classList.contains('hidden')) {
        moreResults.classList.remove('hidden');
        toggleBtn.innerText = 'Sembunyikan ↑';
        othersText.classList.add('hidden');
    } else {
        moreResults.classList.add('hidden');
        toggleBtn.innerText = 'Lihat Semua ↓';
        othersText.classList.remove('hidden');
    }
}

// Open Preview Modal
function openPreview(filename, keyword) {
    const modal = document.getElementById('previewModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBodyText');
    
    console.log('Opening preview for:', filename, 'keyword:', keyword);
    
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    modalTitle.textContent = `Preview: ${filename}`;
    modalBody.innerHTML = '<span>Memuat...</span>';

    fetch('/get-file/' + encodeURIComponent(filename))
        .then(res => {
            console.log('Response status:', res.status);
            if (!res.ok) throw new Error(`HTTP ${res.status}: Gagal memuat file`);
            return res.json();
        })
        .then(data => {
            console.log('File loaded successfully');
            let content = data.content;
            
            // Escape HTML untuk keamanan
            content = content.replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;');
            
            if (keyword) {
                const reg = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
                content = content.replace(reg, '<mark class="modal-highlight">$1</mark>');
            }
            
            modalBody.innerHTML = content;
            setTimeout(() => {
                const first = document.querySelector('.modal-highlight');
                if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        })
        .catch(err => {
            console.error('Preview error:', err);
            modalBody.innerHTML = `<span class="error-message">Error: ${err.message}</span>`;
        });
}

// Close Preview Modal
function closeModal() {
    const modal = document.getElementById('previewModal');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
}

// Event Listeners Setup
document.addEventListener('DOMContentLoaded', function() {
    // Tab buttons
    const folderBtn = document.getElementById('btn-folder');
    const uploadBtn = document.getElementById('btn-upload');
    
    if (folderBtn) {
        folderBtn.addEventListener('click', () => showTab('folder'));
    }
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => showTab('upload'));
    }

    // Toggle results button
    const toggleBtn = document.getElementById('btn-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleResults);
    }

    // Attach file link listeners
    attachFileLinks();

    // Close modal button
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    const modal = document.getElementById('previewModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Set initial tab on page load
    const defaultMode = document.body.getAttribute('data-mode') || 'folder';
    console.log('Default mode:', defaultMode);
    showTab(defaultMode);
    
    // Ensure file links are attached after initial setup
    setTimeout(() => {
        console.log('Re-attaching file links after delay');
        attachFileLinks();
    }, 100);

    // Intercept form submissions to prevent page reload
    const folderForm = document.querySelector('#tab-folder form[action="/search"]');
    const uploadForm = document.querySelector('#tab-upload form[action="/upload-search"]');

    if (folderForm) {
        folderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(folderForm);
            
            fetch('/search', {
                method: 'POST',
                body: formData
            })
            .then(res => res.text())
            .then(html => {
                // Parse response and update only the folder tab content
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newContent = doc.querySelector('#tab-folder');
                
                if (newContent) {
                    const currentFolderTab = document.querySelector('#tab-folder');
                    currentFolderTab.innerHTML = newContent.innerHTML;
                    
                    // Re-attach event listeners to new content
                    attachFileLinks();
                    
                    // Keep tab on folder
                    showTab('folder');
                }
            })
            .catch(err => {
                console.error('Folder search error:', err);
                alert('Error: Gagal melakukan pencarian');
            });
        });
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(uploadForm);
            
            fetch('/upload-search', {
                method: 'POST',
                body: formData
            })
            .then(res => res.text())
            .then(html => {
                // Parse response and update only the upload tab content
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newContent = doc.querySelector('#tab-upload');
                
                if (newContent) {
                    const currentUploadTab = document.querySelector('#tab-upload');
                    currentUploadTab.innerHTML = newContent.innerHTML;
                    
                    // Re-attach event listeners to new content
                    attachFileLinks();
                    
                    // Keep tab on upload
                    showTab('upload');
                }
            })
            .catch(err => {
                console.error('Upload search error:', err);
                alert('Error: Gagal melakukan pencarian');
            });
        });
    }
});

// Helper function to attach file link listeners using event delegation
function attachFileLinks() {
    // Gunakan event delegation - attach ke parent container
    const tabFolder = document.getElementById('tab-folder');
    const tabUpload = document.getElementById('tab-upload');
    
    console.log('Attaching file links...');
    console.log('Tab folder:', tabFolder);
    console.log('Tab upload:', tabUpload);
    
    // Attach ke folder tab
    if (tabFolder) {
        tabFolder.removeEventListener('click', handleFileClick);
        tabFolder.addEventListener('click', handleFileClick);
        console.log('Folder event listener attached');
    }
    
    // Attach ke upload tab
    if (tabUpload) {
        tabUpload.removeEventListener('click', handleFileClick);
        tabUpload.addEventListener('click', handleFileClick);
        console.log('Upload event listener attached');
    }
}

// Handle file link clicks using delegation
function handleFileClick(e) {
    console.log('Click event triggered on:', e.target.tagName, e.target.className);
    
    if (e.target.classList.contains('file-link')) {
        e.preventDefault();
        e.stopPropagation();
        const filename = e.target.getAttribute('data-filename');
        const keyword = e.target.getAttribute('data-keyword') || '';
        console.log('File link clicked:', filename, 'keyword:', keyword);
        openPreview(filename, keyword);
    }
}
// Keyboard accessibility - Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('previewModal');
        if (modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    }
});
