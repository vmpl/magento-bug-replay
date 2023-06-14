<?php declare(strict_types=1);

namespace VMPL\BugReplay\Model;

use VMPL\BugReplay\Api\Data\UploadedSessionInterface;

class UploadedSession extends \Magento\Framework\Model\AbstractExtensibleModel implements UploadedSessionInterface
{
    protected $_eventPrefix = 'vmpl_uploaded_session';
    protected $_eventObject = 'uploaded_session';

    protected function _construct()
    {
        $this->_init(ResourceModel\UploadedSession::class);
    }
}
