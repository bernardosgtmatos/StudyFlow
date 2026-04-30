// script.js - Passo 6: Versão Final com Relatório Pós-Sessão
console.log("🚀 StudyFlow iniciado - Versão Completa");

// --- Elementos DOM ---
const timerDisplay = document.getElementById('timerDisplay');
const pauseCountDisplay = document.getElementById('pauseCountDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const finishBtn = document.getElementById('finishBtn');
const historyListDiv = document.getElementById('historyList');
const dailyReportContainer = document.getElementById('dailyReportContainer');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// --- Estado do cronômetro ---
let isRunning = false;
let timerInterval = null;
let currentSeconds = 0;
let currentPauses = 0;

// --- CONSTANTES ---
const STORAGE_KEY = 'studySessions';

// ========== FUNÇÕES DE PERSISTÊNCIA ==========

function getAllSessions() {
    const sessionsJson = localStorage.getItem(STORAGE_KEY);
    if (!sessionsJson) return [];
    try {
        const sessions = JSON.parse(sessionsJson);
        return Array.isArray(sessions) ? sessions : [];
    } catch (error) {
        console.error('Erro ao carregar sessões:', error);
        return [];
    }
}

function saveSession(sessionData) {
    const sessions = getAllSessions();
    sessions.push(sessionData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    console.log('💾 Sessão salva:', sessionData);
}

function saveCurrentSession(totalMinutes, pauses) {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const displayDate = now.toLocaleDateString('pt-BR');
    const dayOfWeek = now.toLocaleDateString('pt-BR', { weekday: 'long' });
    
    const session = {
        id: Date.now(),
        date: today,
        displayDate: displayDate,
        dayOfWeek: dayOfWeek,
        minutes: totalMinutes,
        pauses: pauses,
        timestamp: now.getTime(),
        seconds: currentSeconds
    };
    
    const sessions = getAllSessions();
    const existingSessionIndex = sessions.findIndex(s => s.date === today);
    
    if (existingSessionIndex !== -1) {
        const userChoice = confirm(
            `📅 Você já estudou ${sessions[existingSessionIndex].minutes} minutos hoje.\n\n` +
            `Deseja:\n` +
            `✅ "OK" - Substituir a sessão de hoje\n` +
            `❌ "Cancelar" - Somar os minutos (${sessions[existingSessionIndex].minutes + totalMinutes} no total)`
        );
        
        if (userChoice) {
            sessions[existingSessionIndex] = session;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
            console.log('🔄 Sessão substituída');
            return session; // Retornar sessão salva
        } else {
            const mergedSession = {
                ...sessions[existingSessionIndex],
                minutes: sessions[existingSessionIndex].minutes + totalMinutes,
                pauses: sessions[existingSessionIndex].pauses + pauses,
                timestamp: Math.max(sessions[existingSessionIndex].timestamp, now.getTime()),
                seconds: sessions[existingSessionIndex].seconds + currentSeconds
            };
            sessions[existingSessionIndex] = mergedSession;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
            console.log('➕ Minutos somados à sessão de hoje');
            return mergedSession; // Retornar sessão mesclada
        }
    } else {
        saveSession(session);
        return session; // Retornar nova sessão
    }
}

function getSessionsSorted() {
    const sessions = getAllSessions();
    return sessions.sort((a, b) => b.timestamp - a.timestamp);
}

function formatMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
    return `${hours}h ${mins}min`;
}

// ========== FUNÇÕES DO RELATÓRIO DIÁRIO ==========

function calculateLast7DaysAverage() {
    const sessions = getAllSessions();
    const last7Days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const session = sessions.find(s => s.date === dateStr);
        last7Days.push(session ? session.minutes : 0);
    }
    
    const total = last7Days.reduce((sum, minutes) => sum + minutes, 0);
    return Math.round(total / 7);
}

function getWeeklyStats() {
    const sessions = getAllSessions();
    const weeklyData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const session = sessions.find(s => s.date === dateStr);
        const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        
        weeklyData.push({
            date: dateStr,
            dayName: dayName,
            minutes: session ? session.minutes : 0,
            hasStudied: session && session.minutes > 0
        });
    }
    
    return weeklyData;
}

function getMotivationalMessage(todayMinutes, weeklyAverage, comparison) {
    if (todayMinutes === 0) {
        const messages = [
            "🚀 Comece agora mesmo! Cada minuto conta na sua jornada.",
            "💪 Hoje é um novo dia para criar hábitos incríveis!",
            "📚 Lembre-se: consistência é mais importante que intensidade.",
            "🎯 Pequenos passos hoje geram grandes resultados amanhã."
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    if (comparison === 'above') {
        const messages = [
            "🌟 Excelente! Você está superando sua média!",
            "🚀 Impressionante! Continue com esse ritmo!",
            "💪 Você está evoluindo muito! Mantenha o foco!",
            "🎯 Parabéns! Disciplina está te levando longe!"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    } else if (comparison === 'below') {
        const messages = [
            "📈 Amanhã é uma nova chance para melhorar!",
            "💪 Não desanime! A consistência virá com o tempo.",
            "🎯 Que tal tentar estudar um pouco mais amanhã?",
            "🌟 Todo grande progresso começa com pequenos passos."
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    } else {
        const messages = [
            "🎯 No caminho certo! Mantenha a consistência!",
            "📚 Bom trabalho! Continue seguindo sua média!",
            "💪 Está no ritmo! Que tal aumentar um pouco amanhã?",
            "🌟 Consistência é a chave do sucesso!"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
}

function generateDailyReport() {
    const sessions = getAllSessions();
    const today = new Date().toISOString().split('T')[0];
    const todaySession = sessions.find(s => s.date === today);
    const todayMinutes = todaySession ? todaySession.minutes : 0;
    const todayPauses = todaySession ? todaySession.pauses : 0;
    
    const weeklyAverage = calculateLast7DaysAverage();
    const weeklyStats = getWeeklyStats();
    
    let comparison = 'equal';
    let comparisonText = 'igual à';
    let comparisonColor = 'text-blue-600';
    let comparisonIcon = '📊';
    
    if (todayMinutes > weeklyAverage && weeklyAverage > 0) {
        comparison = 'above';
        comparisonText = 'acima da';
        comparisonColor = 'text-green-600';
        comparisonIcon = '📈';
    } else if (todayMinutes < weeklyAverage && weeklyAverage > 0) {
        comparison = 'below';
        comparisonText = 'abaixo da';
        comparisonColor = 'text-orange-600';
        comparisonIcon = '📉';
    }
    
    const todayHoursFormatted = formatMinutes(todayMinutes);
    const averageHoursFormatted = formatMinutes(weeklyAverage);
    const motivationalMessage = getMotivationalMessage(todayMinutes, weeklyAverage, comparison);
    
    return `
        <div class="space-y-4">
            <div class="text-center pb-3 border-b border-gray-200">
                <div class="text-3xl mb-2">${todayMinutes > 0 ? '✅' : '⏰'}</div>
                <h3 class="font-bold text-gray-800 text-lg">
                    ${new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
            </div>
            
            <div class="bg-gradient-to-r ${todayMinutes > 0 ? 'from-indigo-50 to-purple-50' : 'from-gray-50 to-slate-50'} rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-gray-600 font-medium">⏱️ Total estudado</span>
                    <span class="text-2xl font-bold text-indigo-600">${todayHoursFormatted}</span>
                </div>
                ${todayMinutes > 0 ? `
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-500">⏸️ Pausas</span>
                        <span class="font-medium text-gray-700">${todayPauses} ${todayPauses === 1 ? 'pausa' : 'pausas'}</span>
                    </div>
                ` : ''}
            </div>
            
            ${weeklyAverage > 0 || todayMinutes > 0 ? `
                <div class="bg-blue-50 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-blue-800 font-medium">${comparisonIcon} Comparação</span>
                        <span class="text-xs text-blue-600">Últimos 7 dias</span>
                    </div>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">🎯 Sua média (7 dias)</span>
                            <span class="font-bold text-blue-700">${averageHoursFormatted}/dia</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">📊 Hoje está</span>
                            <span class="font-bold ${comparisonColor}">${comparisonText} média</span>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <div class="bg-white rounded-lg p-4 border border-gray-200">
                <p class="text-sm font-medium text-gray-700 mb-3">📅 Últimos 7 dias</p>
                <div class="flex justify-between items-end gap-1">
                    ${weeklyStats.map(day => `
                        <div class="flex-1 text-center">
                            <div class="bg-gray-100 rounded-t-lg overflow-hidden" style="height: 80px;">
                                <div class="bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-300"
                                     style="height: ${(day.minutes / 240) * 80}px; width: 100%;"></div>
                            </div>
                            <p class="text-xs text-gray-600 mt-1">${day.dayName}</p>
                            <p class="text-xs font-medium ${day.minutes > 0 ? 'text-indigo-600' : 'text-gray-400'}">
                                ${day.minutes > 0 ? formatMinutes(day.minutes) : '—'}
                            </p>
                        </div>
                    `).join('')}
                </div>
                <p class="text-xs text-gray-400 text-center mt-3">Meta: 4h/dia (barra cheia)</p>
            </div>
            
            <div class="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                <div class="flex gap-2">
                    <span class="text-2xl">💡</span>
                    <p class="text-amber-800 text-sm leading-relaxed">${motivationalMessage}</p>
                </div>
            </div>
            
            ${todayMinutes === 0 ? `
                <div class="bg-gray-50 rounded-lg p-3 text-center">
                    <p class="text-gray-500 text-xs">🎯 Que tal estudar por pelo menos 25 minutos hoje?</p>
                </div>
            ` : todayMinutes < 60 ? `
                <div class="bg-blue-50 rounded-lg p-3 text-center">
                    <p class="text-blue-600 text-xs">💪 Você está a ${60 - todayMinutes} minutos de atingir 1 hora de estudo!</p>
                </div>
            ` : todayMinutes >= 120 ? `
                <div class="bg-green-50 rounded-lg p-3 text-center">
                    <p class="text-green-600 text-xs">🏆 Incrível! Você estudou mais de 2 horas hoje!</p>
                </div>
            ` : ''}
        </div>
    `;
}

function updateDailyReport() {
    const reportHtml = generateDailyReport();
    dailyReportContainer.innerHTML = reportHtml;
}

// ========== PASSO 6: RELATÓRIO PÓS-SESSÃO ==========

// --- Função para mostrar modal de relatório pós-sessão ---
function showSessionSummaryModal(sessionData, comparison, weeklyAverage) {
    // Criar elemento modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn';
    modalOverlay.style.animation = 'fadeIn 0.3s ease-out';
    
    const formattedTime = formatMinutes(sessionData.minutes);
    const averageFormatted = formatMinutes(weeklyAverage);
    const pauseText = sessionData.pauses === 1 ? 'pausa' : 'pausas';
    
    let comparisonEmoji = '';
    let comparisonMessage = '';
    let comparisonColor = '';
    
    if (comparison === 'above') {
        comparisonEmoji = '🎉';
        comparisonMessage = `ACIMA da sua média (${averageFormatted})`;
        comparisonColor = 'text-green-600';
    } else if (comparison === 'below') {
        comparisonEmoji = '💪';
        comparisonMessage = `ABAIXO da sua média (${averageFormatted})`;
        comparisonColor = 'text-orange-600';
    } else {
        comparisonEmoji = '📊';
        comparisonMessage = `IGUAL à sua média (${averageFormatted})`;
        comparisonColor = 'text-blue-600';
    }
    
    modalOverlay.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all scale-100">
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-4 text-white">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold">✅ Sessão Finalizada!</h3>
                    <span class="text-3xl">🎯</span>
                </div>
            </div>
            
            <div class="p-6 space-y-4">
                <div class="text-center">
                    <div class="text-5xl mb-2">${comparisonEmoji}</div>
                    <p class="text-gray-600">Hoje você estudou</p>
                    <p class="text-3xl font-bold text-indigo-600 my-2">${formattedTime}</p>
                    <p class="text-sm text-gray-500">com ${sessionData.pauses} ${pauseText}</p>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4 text-center">
                    <p class="text-sm text-gray-600 mb-1">Comparação com sua média</p>
                    <p class="font-bold ${comparisonColor}">${comparisonMessage}</p>
                </div>
                
                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">🏆 Meta diária (1h)</span>
                        <span class="font-medium ${sessionData.minutes >= 60 ? 'text-green-600' : 'text-orange-600'}">
                            ${sessionData.minutes >= 60 ? '✅ Atingida!' : `${sessionData.minutes}/60 min`}
                        </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-700"
                             style="width: ${Math.min((sessionData.minutes / 240) * 100, 100)}%"></div>
                    </div>
                </div>
                
                <div class="bg-amber-50 rounded-lg p-3 border border-amber-200">
                    <p class="text-amber-800 text-sm text-center">
                        💡 ${getMotivationalMessage(sessionData.minutes, weeklyAverage, comparison)}
                    </p>
                </div>
                
                <button id="closeModalBtn" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                    Ver relatório completo
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    
    // Adicionar estilo de animação
    if (!document.querySelector('#modalStyles')) {
        const style = document.createElement('style');
        style.id = 'modalStyles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes scaleIn {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .animate-fadeIn {
                animation: fadeIn 0.3s ease-out;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fechar modal e atualizar UI
    const closeBtn = modalOverlay.querySelector('#closeModalBtn');
    closeBtn.addEventListener('click', () => {
        modalOverlay.remove();
        renderHistory();
        updateDailyReport();
    });
    
    // Fechar ao clicar no overlay
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
            renderHistory();
            updateDailyReport();
        }
    });
}

// ========== FUNÇÕES DO CRONÔMETRO ==========

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(currentSeconds);
}

function updatePauseDisplay() {
    pauseCountDisplay.textContent = currentPauses;
}

function tick() {
    if (isRunning) {
        currentSeconds++;
        updateTimerDisplay();
    }
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(tick, 1000);
        
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        finishBtn.disabled = false;
        
        startBtn.classList.remove('bg-emerald-500', 'hover:bg-emerald-600');
        startBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
        pauseBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
        pauseBtn.classList.add('bg-amber-500', 'hover:bg-amber-600');
        finishBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
        finishBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
        
        console.log("✅ Cronômetro iniciado");
    }
}

function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        
        currentPauses++;
        updatePauseDisplay();
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        finishBtn.disabled = false;
        
        startBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
        startBtn.classList.add('bg-emerald-500', 'hover:bg-emerald-600');
        pauseBtn.classList.remove('bg-amber-500', 'hover:bg-amber-600');
        pauseBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
        
        console.log(`⏸️ Pausa #${currentPauses}`);
    }
}

// --- FINALIZAR SESSÃO COM RELATÓRIO PÓS-SESSÃO (PASSO 6) ---
function finishSession() {
    if (currentSeconds === 0 && currentPauses === 0) {
        alert("Nenhuma sessão para registrar. Estude um pouco antes de finalizar!");
        return;
    }
    
    if (isRunning) {
        isRunning = false;
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    
    const totalMinutes = Math.floor(currentSeconds / 60);
    const remainingSeconds = currentSeconds % 60;
    const finalMinutes = remainingSeconds >= 30 ? totalMinutes + 1 : totalMinutes;
    
    // Salvar sessão e obter dados salvos
    const savedSession = saveCurrentSession(finalMinutes, currentPauses);
    
    // Calcular média semanal para comparação
    const weeklyAverage = calculateLast7DaysAverage();
    
    // Determinar comparação
    let comparison = 'equal';
    if (savedSession.minutes > weeklyAverage && weeklyAverage > 0) {
        comparison = 'above';
    } else if (savedSession.minutes < weeklyAverage && weeklyAverage > 0) {
        comparison = 'below';
    }
    
    // Mostrar modal com relatório da sessão (PASSO 6)
    showSessionSummaryModal(savedSession, comparison, weeklyAverage);
    
    // Resetar estado atual
    resetCurrentSession();
    
    // As atualizações de UI serão feitas após fechar o modal
}

function resetCurrentSession() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    isRunning = false;
    currentSeconds = 0;
    currentPauses = 0;
    
    updateTimerDisplay();
    updatePauseDisplay();
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    finishBtn.disabled = true;
    
    startBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
    startBtn.classList.add('bg-emerald-500', 'hover:bg-emerald-600');
    pauseBtn.classList.remove('bg-amber-500', 'hover:bg-amber-600');
    pauseBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
    finishBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
    finishBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
}

// ========== FUNÇÕES DO HISTÓRICO ==========

function getHistoricalStats() {
    const sessions = getAllSessions();
    if (sessions.length === 0) return null;
    
    const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
    const totalPauses = sessions.reduce((sum, s) => sum + s.pauses, 0);
    const averageMinutes = Math.round(totalMinutes / sessions.length);
    const totalDays = sessions.length;
    const bestDay = sessions.reduce((best, s) => s.minutes > best.minutes ? s : best, sessions[0]);
    
    return { totalMinutes, totalPauses, averageMinutes, totalDays, bestDay };
}

function renderHistory() {
    const sessions = getSessionsSorted();
    
    if (sessions.length === 0) {
        historyListDiv.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">📭</div>
                <p class="text-gray-400 font-medium">Nenhum registro encontrado</p>
                <p class="text-gray-400 text-sm mt-2">Finalize uma sessão para começar!</p>
            </div>
        `;
        return;
    }
    
    const stats = getHistoricalStats();
    let historyHtml = `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 pb-4 border-b border-gray-200">
            <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 text-center">
                <div class="text-2xl mb-1">📚</div>
                <div class="text-xl font-bold text-indigo-700">${stats.totalDays}</div>
                <div class="text-xs text-gray-600">dias estudados</div>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 text-center">
                <div class="text-2xl mb-1">⏱️</div>
                <div class="text-xl font-bold text-emerald-700">${formatMinutes(stats.totalMinutes)}</div>
                <div class="text-xs text-gray-600">total estudado</div>
            </div>
            <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 text-center">
                <div class="text-2xl mb-1">📊</div>
                <div class="text-xl font-bold text-amber-700">${formatMinutes(stats.averageMinutes)}</div>
                <div class="text-xs text-gray-600">média por dia</div>
            </div>
            <div class="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-3 text-center">
                <div class="text-2xl mb-1">🏆</div>
                <div class="text-sm font-bold text-rose-700 truncate">${stats.bestDay.displayDate}</div>
                <div class="text-xs text-gray-600">melhor dia</div>
            </div>
        </div>
        <div class="space-y-2 max-h-96 overflow-y-auto pr-2">
    `;
    
    sessions.forEach(session => {
        const formattedTime = formatMinutes(session.minutes);
        const pauseText = session.pauses === 1 ? 'pausa' : 'pausas';
        const hasStudied = session.minutes > 0;
        
        let statusIcon = '✅';
        let statusColor = 'text-green-700';
        let bgColor = 'bg-gradient-to-r from-green-50 to-emerald-50';
        let borderColor = 'border-green-200';
        
        if (!hasStudied) {
            statusIcon = '❌';
            statusColor = 'text-red-600';
            bgColor = 'bg-gray-50';
            borderColor = 'border-gray-200';
        } else if (session.minutes >= 120) {
            statusIcon = '🔥';
            statusColor = 'text-orange-600';
            bgColor = 'bg-gradient-to-r from-orange-50 to-amber-50';
            borderColor = 'border-orange-200';
        } else if (session.minutes >= 60) {
            statusIcon = '⭐';
            statusColor = 'text-indigo-600';
            bgColor = 'bg-gradient-to-r from-indigo-50 to-blue-50';
            borderColor = 'border-indigo-200';
        }
        
        historyHtml += `
            <div class="${bgColor} border ${borderColor} rounded-lg p-3 transition-all duration-200 hover:shadow-md cursor-pointer group"
                 onclick="showSessionDetails('${session.id}')">
                <div class="flex justify-between items-center flex-wrap gap-2">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">${statusIcon}</span>
                        <div>
                            <div class="font-semibold text-gray-800 flex items-center gap-2">
                                ${session.displayDate}
                                <span class="text-xs text-gray-400 capitalize">${session.dayOfWeek || ''}</span>
                            </div>
                            <div class="text-sm ${statusColor}">
                                ${formattedTime} • ${session.pauses} ${pauseText}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="text-sm bg-white/70 ${hasStudied ? 'text-indigo-600' : 'text-gray-400'} px-3 py-1 rounded-full font-medium">
                            ${hasStudied ? Math.round(session.minutes / 60 * 10) / 10 + 'h' : 'Sem estudos'}
                        </div>
                        <button onclick="event.stopPropagation(); deleteSession('${session.id}')" 
                                class="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1">
                            🗑️
                        </button>
                    </div>
                </div>
                ${hasStudied ? `
                    <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                             style="width: ${Math.min((session.minutes / 240) * 100, 100)}%"></div>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    historyHtml += `</div>`;
    historyListDiv.innerHTML = historyHtml;
}

window.showSessionDetails = function(sessionId) {
    const sessions = getAllSessions();
    const session = sessions.find(s => s.id == sessionId);
    if (!session) return;
    
    const formattedTime = formatMinutes(session.minutes);
    const pauseText = session.pauses === 1 ? 'pausa' : 'pausas';
    const hoursDecimal = (session.minutes / 60).toFixed(1);
    
    alert(
        `📊 Detalhes do dia ${session.displayDate}\n\n` +
        `⏱️ Tempo estudado: ${formattedTime} (${hoursDecimal}h)\n` +
        `⏸️ Pausas: ${session.pauses} ${pauseText}\n` +
        `📈 Média de estudo: ${formatMinutes(session.minutes)} por sessão\n` +
        `🎯 Meta: ${session.minutes >= 60 ? '✅ Meta diária atingida!' : '⚠️ Abaixo de 1 hora'}\n\n` +
        `💡 Dica: Estude regularmente para manter o progresso!`
    );
};

window.deleteSession = function(sessionId) {
    if (confirm('⚠️ Tem certeza que deseja deletar este dia do histórico?')) {
        let sessions = getAllSessions();
        sessions = sessions.filter(s => s.id != sessionId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
        renderHistory();
        updateDailyReport();
        console.log(`🗑️ Sessão ${sessionId} deletada`);
    }
};

function clearHistory() {
    if (confirm('⚠️ ATENÇÃO: Isso apagará TODO o histórico de estudos permanentemente.\n\nEsta ação não pode ser desfeita!')) {
        localStorage.removeItem(STORAGE_KEY);
        renderHistory();
        updateDailyReport();
        console.log("🗑️ Histórico completamente limpo");
        alert("🗑️ Histórico apagado com sucesso!");
    }
}

// --- Event listeners ---
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
finishBtn.addEventListener('click', finishSession);
clearHistoryBtn.addEventListener('click', clearHistory);

// --- Inicialização ---
window.addEventListener('DOMContentLoaded', () => {
    console.log("📱 StudyFlow inicializado - Versão Completa com Relatório Pós-Sessão");
    resetCurrentSession();
    renderHistory();
    updateDailyReport();
});