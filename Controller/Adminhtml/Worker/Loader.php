<?php declare(strict_types=1);

namespace VMPL\BugReplay\Controller\Adminhtml\Worker;

class Loader extends \VMPL\BugReplay\Controller\Worker\Loader
{
    protected function getWorkerFile()
    {
        $workerFile = [];
        foreach ($this->request->getParams() as $key => $value) {
            if ($key === 'key') {
                continue;
            }

            $workerFile[] = "{$key}/{$value}";
        }
        return trim(implode("/", $workerFile), '/');
    }
}
