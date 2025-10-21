<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método inválido']);
    exit;
}

// Lista de campos esperados
$campos = [
    'empresa','contato','email','telefone','data','objetivo','problemas','publico','expectativas',
    'design','cores','referencias','navegacao','funcionalidades','recurso','prioridades',
    'paginas','menu','conteudo','conteudo_atual','conteudo_dinamico','integracoes',
    'prazo','orcamento','manutencao','feedback'
];

// Função simples de sanitização
function s($v) { return trim(strip_tags((string)$v)); }

$data = [];
foreach ($campos as $c) {
    $data[$c] = isset($_POST[$c]) ? s($_POST[$c]) : '';
}

// valida email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'E-mail inválido']);
    exit;
}

// monta mensagem
$subject = 'Novo questionário — ' . ($data['empresa'] ?: 'Sem empresa');
$message = "Novo questionário recebido:\n\n";
foreach ($data as $k => $v) {
    $label = ucfirst(str_replace('_',' ',$k));
    $message .= "$label: " . ($v === '' ? '-' : $v) . "\n\n";
}

// destinatário
$to = 'all4nfr4g4@gmail.com';

// headers (evitar injeção em headers)
$replyTo = str_replace(["\r", "\n"], '', $data['email']);
$headers  = "From: no-reply@seusite.com\r\n";
$headers .= "Reply-To: $replyTo\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// enviar (nota: depende da configuração de e-mail do servidor)
$sent = mail($to, $subject, $message, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Formulário enviado com sucesso.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Falha ao enviar. Verifique a configuração de e-mail do servidor (SMTP/sendmail).']);
}
?>
