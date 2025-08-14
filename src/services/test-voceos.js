/**
 * Script de prueba para el servicio de voceos
 * Ejecutar con: node src/services/test-voceos.js
 */

import { VoceosService } from './voceos.service.js';

async function testVoceosService() {
    console.log('🎤 Iniciando pruebas del servicio de voceos...');
    console.log('=' .repeat(50));
    
    try {
        // Prueba 1: Consulta básica sin filtro de departamento
        console.log('\n📋 Prueba 1: Consulta básica (todos los departamentos)');
        console.log('Consultando voceos del 2025-01-01 al 2025-01-02...');
        
        const voceos1 = await VoceosService.getVoceos('2025-01-01', '2025-01-02');
        console.log(`✅ Resultados encontrados: ${voceos1.length}`);
        
        if (voceos1.length > 0) {
            console.log('📄 Primer registro:');
            console.log(JSON.stringify(voceos1[0], null, 2));
        }
        
        // Formatear mensaje
        const message1 = VoceosService.formatVoceosMessage(voceos1, '2025-01-01', '2025-01-02');
        console.log('\n📱 Mensaje formateado:');
        console.log(message1.substring(0, 500) + (message1.length > 500 ? '...' : ''));
        
    } catch (error) {
        console.error('❌ Error en Prueba 1:', error.message);
    }
    
    try {
        // Prueba 2: Consulta con filtro de departamento
        console.log('\n\n📋 Prueba 2: Consulta con filtro de departamento');
        console.log('Consultando voceos del departamento 003...');
        
        const voceos2 = await VoceosService.getVoceos('2025-01-01', '2025-01-02', '003');
        console.log(`✅ Resultados encontrados: ${voceos2.length}`);
        
        if (voceos2.length > 0) {
            console.log('📄 Primer registro:');
            console.log(JSON.stringify(voceos2[0], null, 2));
        }
        
        // Formatear mensaje
        const message2 = VoceosService.formatVoceosMessage(voceos2, '2025-01-01', '2025-01-02', '003');
        console.log('\n📱 Mensaje formateado:');
        console.log(message2.substring(0, 500) + (message2.length > 500 ? '...' : ''));
        
    } catch (error) {
        console.error('❌ Error en Prueba 2:', error.message);
    }
    
    try {
        // Prueba 3: Estadísticas
        console.log('\n\n📊 Prueba 3: Estadísticas por departamento');
        console.log('Generando estadísticas del 2025-01-01 al 2025-01-02...');
        
        const stats = await VoceosService.getVoceosStats('2025-01-01', '2025-01-02');
        console.log(`✅ Departamentos encontrados: ${stats.length}`);
        
        if (stats.length > 0) {
            console.log('📊 Estadísticas:');
            stats.forEach(stat => {
                console.log(`  - Depto ${stat.DepartmentID}: ${stat.TotalVoceos} voceos (${stat.VoceosActivos} activos, ${stat.VoceosInactivos} inactivos)`);
            });
        }
        
        // Formatear mensaje de estadísticas
        const statsMessage = VoceosService.formatStatsMessage(stats, '2025-01-01', '2025-01-02');
        console.log('\n📱 Mensaje de estadísticas formateado:');
        console.log(statsMessage);
        
    } catch (error) {
        console.error('❌ Error en Prueba 3:', error.message);
    }
    
    try {
        // Prueba 4: Consulta sin resultados
        console.log('\n\n📋 Prueba 4: Consulta sin resultados');
        console.log('Consultando voceos de una fecha futura...');
        
        const voceos4 = await VoceosService.getVoceos('2030-01-01', '2030-01-02');
        console.log(`✅ Resultados encontrados: ${voceos4.length}`);
        
        // Formatear mensaje vacío
        const message4 = VoceosService.formatVoceosMessage(voceos4, '2030-01-01', '2030-01-02');
        console.log('\n📱 Mensaje sin resultados:');
        console.log(message4);
        
    } catch (error) {
        console.error('❌ Error en Prueba 4:', error.message);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Pruebas completadas');
}

// Ejecutar las pruebas
testVoceosService().catch(error => {
    console.error('💥 Error fatal en las pruebas:', error);
    process.exit(1);
});