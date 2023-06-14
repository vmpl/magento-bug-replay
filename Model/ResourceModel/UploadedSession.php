<?php declare(strict_types=1);

namespace VMPL\BugReplay\Model\ResourceModel;

class UploadedSession extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected $_isPkAutoIncrement = false;
    protected $_useIsObjectNew = true;

    protected function _construct()
    {
        $this->_init('vmpl_uploaded_sessions', 'hash');
    }
}
